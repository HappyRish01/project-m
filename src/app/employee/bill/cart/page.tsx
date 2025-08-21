"use client";

import { useState } from "react";
import { CartItemList } from "@/components/card-item-list";
import { BillingForm } from "@/components/billing-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Receipt, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { toast } from "sonner";
import type { BillingDetails } from "@/types/billing";

export default function CartPage() {
  const {
    items,
    getTotalAmount,
    clearCart,
    getSubtotal,
    getGSTBreakdown,
    getTotalGST,
  } = useCart();
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    date: new Date().toLocaleDateString("en-CA"),
    customerName: "",
    address: "",
    city: "",
    pinCode: "",
    country: "India",
    panNumber: "",
    gstinNumber: "",
  });

  const totalAmount = getTotalAmount();
  const subTotal = getSubtotal();
  const gstBreakdown = getGSTBreakdown();
  const totalGst = getTotalGST();
  const [progress , setProgress] = useState(false);

  const handleCreateBill = async () => {
        setProgress(true);

    if (items.length === 0) {
      alert("Please add items to cart first");
      return;
    }

    if (!billingDetails.customerName || !billingDetails.address) {
      alert("Please fill in required billing details");
      return;
    }
    try {
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          billingDetails,
          totalAmount,
          subTotal,
          gstBreakdown,
          totalGst,
        }),
      });
      if (!res.ok) {
        toast("Error occured");
        return 
      }

      const data = await res.json();
      const billId = data.bill.id;
      const billName = data.bill.name;

    toast(`Bill created for ${billName}`);

       const pdfRes = await fetch("/api/bills/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billId }), 
    });

    if (!pdfRes.ok) {
      toast("Error generating PDF");
      return;
    }
    const blob = await pdfRes.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `bill-${billName}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    } catch (error: any) {
      toast("Error occured", error.message);
    }finally{
      setProgress(false);
    }

    // Clear cart after successful bill creation
    clearCart();

    // You might want to redirect to a success page or bills list
    // router.push("/admin")
  };

  if (items.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <Link href="/employee/bill">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Receipt className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products to create a bill
          </p>
          <Link href="/employee/bill">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/employee/bill">
          <Button variant="ghost" className="flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Create Bill
        </h1>
        <p className="text-gray-600 mt-2">
          Review items and fill billing details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Cart Items */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Selected Items ({items.length})
                </div>

                {/* Right side - Delete button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearCart} // call from useCart
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <CartItemList />
            </CardContent>
          </Card>

          {/* Total Amount Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>

              {/* GST Breakdown */}
              {Object.entries(gstBreakdown).map(([rate, amount]) => (
                <div
                  key={rate}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>GST ({rate}%):</span>
                  <span>₹{amount.toFixed(2)}</span>
                </div>
              ))}

              {/* Total GST */}
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>Total GST:</span>
                <span>₹{totalGst.toFixed(2)}</span>
              </div>

              {/* Final Total */}
              <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                <span>Total Amount:</span>
                <span className="text-2xl text-green-600">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Billing Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <BillingForm
                billingDetails={billingDetails}
                setBillingDetails={setBillingDetails}
              />
            </CardContent>
          </Card>

          {/* Create Bill Button */}
         <Button
            onClick={handleCreateBill}
            className="w-full h-12 text-lg"
            size="lg"
            disabled={progress}
          >
            {
              progress
        ? "Processing..."
        : `Create Bill - ₹${totalAmount.toFixed(2)}`
            }
          </Button>
        </div>
      </div>
    </div>
  );
}
