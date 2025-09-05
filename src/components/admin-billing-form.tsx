"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BillingDetails } from "@/types/billing"
import {statesCode} from "@/lib/config/state_code"
import { predefinedVehicles } from "@/lib/config/predefinedvehicles"

interface BillingFormProps {
  billingDetails: BillingDetails
  setBillingDetails: (details: BillingDetails) => void
}

export function BillingForm({ billingDetails, setBillingDetails }: BillingFormProps) {
  const handleInputChange = (field: keyof BillingDetails, value: string) => {
    setBillingDetails({
      ...billingDetails,
      [field]: value,
    })
  }
  const handleStateChange = (stateName: string) => {
    const selectedState = statesCode.find(s => s.name === stateName)
    setBillingDetails({
      ...billingDetails,
      state: stateName,
      stateCode: selectedState ? selectedState.code : ""
    })
  }

  return (
    <div className="space-y-4">
      {/* BillNumber */}
      <div className="space-y-2">
        <Label htmlFor="billNumber">Enter bill number *</Label>
        <Input
          placeholder="Enter bill number"
          id="billNumber"
          type="number"
          value={billingDetails.billNumber}
          onChange={(e) => handleInputChange("billNumber", e.target.value)}
          required
        />
      </div>
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={billingDetails.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          required
        />
      </div>

      {/* Customer Name */}
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name *</Label>
        <Input
          id="customerName"
          type="text"
          placeholder="Enter customer name"
          value={billingDetails.customerName}
          onChange={(e) => handleInputChange("customerName", e.target.value)}
          required
        />
      </div>

      {/* Address Fields */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Address *</Label>

        <div className="space-y-3">
          <Input
            placeholder="Street address"
            value={billingDetails.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="City/Town"
              value={billingDetails.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
            <Input
              placeholder="PIN Code"
              value={billingDetails.pinCode}
              onChange={(e) => handleInputChange("pinCode", e.target.value)}
              required
            />
          </div>

          <Input
            placeholder="Country"
            value={billingDetails.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            required
          />
        </div>
      </div>
      {/* State Selector */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <select
                id="state"
                className="border rounded-md p-2 w-full"
                value={billingDetails.state || ""}
                onChange={(e) => handleStateChange(e.target.value)}
                required
              >
                <option value="">Select state</option>
                {statesCode.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
      
            {/* State Code - Auto Filled */}
            <div className="space-y-2">
              <Label htmlFor="stateCode">State Code</Label>
              <Input
                id="stateCode"
                type="text"
                value={billingDetails.stateCode || ""}
                readOnly
              />
            </div>

      

      {/* GSTIN Number */}
      <div className="space-y-2">
        <Label htmlFor="gstinNumber">GSTIN Number</Label>
        <Input
          id="gstinNumber"
          type="text"
          placeholder="Enter GSTIN number"
          value={billingDetails.gstinNumber}
          onChange={(e) => handleInputChange("gstinNumber", e.target.value.toUpperCase())}
          maxLength={15}
          autoComplete="tel"
        />
      </div>
      {/* PAN Number */}
      <div className="space-y-2">
        <Label htmlFor="panNumber">PAN Number</Label>
        <Input
          id="panNumber"
          type="text"
          placeholder="Enter PAN number"
          value={billingDetails.panNumber}
          onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
          maxLength={10}
          autoComplete="organization"
        />
      </div>


      {/* Vehicle Number Selector */}
      <div className="space-y-2">
        <Label htmlFor="vehicleNumber">Vehicle Number</Label>
        <select
          id="vehicleNumber"
          className="border rounded-md p-2 w-full"
          value={
            predefinedVehicles.includes(billingDetails.vehicleNumber || "")
              ? billingDetails.vehicleNumber
              : "other"
          }
          onChange={(e) => {
            const selected = e.target.value
            if (selected === "other") {
              setBillingDetails({ ...billingDetails, vehicleNumber: "" })
            } else {
              setBillingDetails({ ...billingDetails, vehicleNumber: selected })
            }
          }}
        >
          <option value="">Select vehicle number</option>
          {predefinedVehicles.map((vehicle) => (
            <option key={vehicle} value={vehicle}>
              {vehicle}
            </option>
          ))}
          <option value="other">Other (Type manually)</option>
        </select>

        {/* Manual input if 'Other' selected */}
        {!predefinedVehicles.includes(billingDetails.vehicleNumber || "") && (
          <Input
            placeholder="Enter vehicle number"
            value={billingDetails.vehicleNumber || ""}
            onChange={(e) => handleInputChange("vehicleNumber", e.target.value.toUpperCase())}
          />
        )}
      </div>
    </div>
  )
}
