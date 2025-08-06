"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bill } from "@/types/bill"
import { format } from "date-fns"
import { Loader2, Download, MoreVertical } from 'lucide-react' // Import Download icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface BillListProps {
  bills: Bill[]
  loading: boolean
  hasMore: boolean
  onDownloadPdf: (billId: number) => void // New prop for PDF download
}

export function BillList({ bills, loading, hasMore, onDownloadPdf }: BillListProps) {
  return (
    <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
      {bills.map((bill) => (
        <Card key={bill.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  Bill #{bill.billNumber}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  Customer: {bill.customerName}
                </p>
              </div>
              <div className="flex flex-col sm:items-end text-sm text-gray-700">
                <span className="font-semibold text-lg">₹{bill.amount.toFixed(2)}</span>
                <span className="text-xs text-gray-500">
                  {format(new Date(bill.date), "MMM dd, yyyy")}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDownloadPdf(bill.id)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                  {/* Add other bill actions here if needed, e.g., Edit, View Details */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}

      {!loading && bills.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No bills found matching your criteria.</p>
        </div>
      )}

      {!loading && !hasMore && bills.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          <p>You've reached the end of the list.</p>
        </div>
      )}
    </div>
  )
}
