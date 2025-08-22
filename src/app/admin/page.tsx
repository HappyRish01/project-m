"use client";

import { useState, useEffect } from "react";
import { BillList } from "@/components/bill-list";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { Bill } from "@/types/bill";
import { Button } from "@/components/ui/button";
import { Loader, XCircle } from "lucide-react";
import { toast } from "sonner";


export default function AdminPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      await fetchBills(selectedDate);
    };
    fetchData();
  }, []);

  const buildQuery = (date: Date , query: string = searchQuery) => {
    const params = new URLSearchParams();
    if (query && query.trim() !== "") {
    // if (searchQuery) {
      params.set("search", query); 
      return `/api/bills?${params.toString()}`;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`
    params.set("selectedDate", dateString);
    return `/api/bills?${params.toString()}`;
  };

  const fetchBills = async (date:Date , query:string = searchQuery) => {
    setLoading(true);
    try {
      const res = await fetch(buildQuery(date , query))
      const data = await res.json();
      

      if (!res.ok) {
        toast.error(`Error: ${data.message || "Failed to fetch bills"}`);
        throw new Error(data.message || "Failed to fetch bills");
      }
      setBills(data.bills || []);
    } catch (err: any) {
      console.error(err.message || "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery(""); //not working
    setSelectedDate(new Date());
    fetchBills(new Date() , "");
    // setStartDate(undefined);
    // setEndDate(undefined);
  };

  const handleDownloadPdf = async(billId: string) => {
    setLoading(true);
    try{
      const res = await fetch("/api/bills/generate",{
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({billId})

      })

      if(!res.ok) {
        throw new Error("Failed to generate bill")
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a");
      a.href = url;
      a.download = `bill-${billId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }catch(error:any) {
      console.error(error)
      alert("Error generating bill pdf")
    } finally {
      setLoading(false)
    }

  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Bill Management
        </h1>
        <p className="text-gray-600 mt-2">
          View and filter all customer bills.
        </p>
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <Input
              type="text"
              placeholder="Search by name, bill #, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            
            />
          </div>

          {!searchQuery && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Exact Date
              </label>
              <DatePicker
                date={selectedDate}
                setDate={setSelectedDate}
                placeholder="Pick exact date"
              />
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => fetchBills(selectedDate)}
            className="mt-6"
          >
            <Loader className="h-4 w-4" />
            Load Bills
          </Button>
          {(searchQuery || selectedDate) && (
            <Button variant="outline" onClick={handleClearFilters}>
              <XCircle className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Bill List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Bills will be shown below</h2>
          <BillList
            bills={bills}
            loading={loading}
            onDownloadPdf={handleDownloadPdf}
          />
          
        </div>
      </div>
    </div>
  );
}
