"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { BillList } from "@/components/bill-list"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/date-picker"
import { Bill } from "@/types/bill"
import { Button } from "@/components/ui/button"
import { XCircle } from 'lucide-react'

// Mock data for bills
const allMockBills: Bill[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  billNumber: `BILL-${1000 + i}`,
  amount: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
  customerName: `Customer ${String.fromCharCode(65 + (i % 26))}${i % 10}`,
  date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
}))

const ITEMS_PER_PAGE = 15

export default function AdminPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined) // For exact date
  const [startDate, setStartDate] = useState<Date | undefined>(undefined) // For date range
  const [endDate, setEndDate] = useState<Date | undefined>(undefined) // For date range

  const observerTarget = useRef<HTMLDivElement>(null)

  const applyFiltersAndSearch = useCallback((data: Bill[]) => {
    let filtered = data

    // Apply search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(bill =>
        bill.customerName.toLowerCase().includes(lowerCaseQuery) ||
        bill.billNumber.toLowerCase().includes(lowerCaseQuery) ||
        bill.amount.toString().includes(lowerCaseQuery) // Search by amount as string
      )
    }

    // Apply date filters based on which state is populated
    if (selectedDate) {
      // Exact date filter takes precedence
      filtered = filtered.filter(bill => {
        const billDateString = new Date(bill.date).toISOString().split('T')[0];
        const selectedDateString = selectedDate.toISOString().split('T')[0];
        return billDateString === selectedDateString;
      });
    } else if (startDate || endDate) {
      // Date range filter if exact date is not selected
      if (startDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        filtered = filtered.filter(bill => new Date(bill.date) >= startOfDay);
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filtered = filtered.filter(bill => new Date(bill.date) <= endOfDay);
      }
    }

    // Sort by date descending (most recent first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered
  }, [searchQuery, selectedDate, startDate, endDate]) // All date states are dependencies

  const fetchBills = useCallback(async (currentPage: number, reset = false) => {
    if (loading) return

    setLoading(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const allFilteredBills = applyFiltersAndSearch(allMockBills)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newBills = allFilteredBills.slice(startIndex, endIndex)

    if (reset) {
      setBills(newBills)
    } else {
      setBills(prevBills => [...prevBills, ...newBills])
    }

    setHasMore(endIndex < allFilteredBills.length)
    setLoading(false)
  }, [loading, applyFiltersAndSearch])

  // Initial fetch and when filters/search change
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchBills(1, true)
  }, [searchQuery, selectedDate, startDate, endDate, fetchBills]) // Dependencies updated

  // Infinite scrolling observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1)
      }
    }, { threshold: 1.0 })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading])

  // Fetch more bills when page changes (due to infinite scroll)
  useEffect(() => {
    if (page > 1) {
      fetchBills(page)
    }
  }, [page, fetchBills])

  // Handlers for date pickers to ensure mutual exclusivity
  const handleSetSelectedDate = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) { // If an exact date is selected, clear range dates
      setStartDate(undefined)
      setEndDate(undefined)
    }
  }

  const handleSetStartDate = (date: Date | undefined) => {
    setStartDate(date)
    if (date) { // If a start date is selected, clear exact date
      setSelectedDate(undefined)
    }
  }

  const handleSetEndDate = (date: Date | undefined) => {
    setEndDate(date)
    if (date) { // If an end date is selected, clear exact date
      setSelectedDate(undefined)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedDate(undefined)
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const handleDownloadPdf = (billId: number) => {
    // In a real application, you would make an API call here
    // For example: fetch(`/api/bills/${billId}/download-pdf`)
    // The backend would generate the PDF and send it as a file download.
    console.log(`Simulating PDF download for Bill ID: ${billId}`)
    alert(`Downloading PDF for Bill ID: ${billId}. (This is a simulation)`)
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bill Management</h1>
        <p className="text-gray-600 mt-2">View and filter all customer bills.</p>
      </div>

      <div className="space-y-6">
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium text-gray-700">Search</label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name, bill #, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Exact Date Picker (visible if no range dates are set) */}
          {!(startDate || endDate) && (
            <div className="space-y-2">
              <label htmlFor="exactDate" className="text-sm font-medium text-gray-700">Exact Date</label>
              <DatePicker
                id="exactDate"
                date={selectedDate}
                setDate={handleSetSelectedDate}
                placeholder="Pick exact date"
              />
            </div>
          )}

          {/* Date Range Pickers (visible if no exact date is set) */}
          {!selectedDate && (
            <>
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-gray-700">From Date</label>
                <DatePicker
                  id="startDate"
                  date={startDate}
                  setDate={handleSetStartDate}
                  placeholder="Start Date"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-gray-700">To Date</label>
                <DatePicker
                  id="endDate"
                  date={endDate}
                  setDate={handleSetEndDate}
                  placeholder="End Date"
                />
              </div>
            </>
          )}

          {(searchQuery || selectedDate || startDate || endDate) && ( // Condition updated for clear button
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="col-span-1 md:col-span-1 lg:col-span-1 flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Bill List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">All Bills</h2>
          <BillList 
            bills={bills} 
            loading={loading} 
            hasMore={hasMore} 
            onDownloadPdf={handleDownloadPdf} // Pass the handler
          />
          {/* Observer target for infinite scrolling */}
          <div ref={observerTarget} className="h-1" />
        </div>
      </div>
    </div>
  )
}
