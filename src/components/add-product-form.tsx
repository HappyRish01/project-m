"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product } from "@/types/product" // Import Product type

interface AddProductFormProps {
  product?: Product | null
  onSubmit: (product: Product) => void
  onCancel?: () => void
}

const unit = [
  "Kata",
  "Peti",
  "Bag"
]

const gstRates = [0, 5, 12, 18, 28]

export function AddProductForm({ product, onSubmit, onCancel }: AddProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    // id: "",
    name: "",
    kgpunit: 0,
    price: 0,
    hsnCode: "",
    gst: 18,
    unit: unit[0]
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        // id: "",
        name: "",
        price:0,
        hsnCode: "",
        kgpunit: 0,
        gst: 18,
        unit: unit[0] // Default unit
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    
    if (!product) {
      // Reset form only when adding new product
      setFormData({
        // id: "",
        name: "",
        kgpunit: 0,
        price: 0,
        hsnCode: "",
        gst: 18,
        unit: unit[0] // Reset to default unit
      })
    }
  }

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {product ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Responsive grid for price and stock */}
          

          <div className="space-y-2">
            <Label htmlFor="hsnCode">HSN Code</Label>
            <Input
              id="hsnCode"
              value={formData.hsnCode}
              onChange={(e) => handleInputChange('hsnCode', e.target.value)}
              placeholder="Enter HSN code"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) per QTL</Label>
              <Input
                id="price"
                type="number"
                step="0.1"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                // placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">Unit</Label>
              <Select 
                // value={formData.unit}
                defaultValue={formData.unit.toString()} 
                // value={String(formData.unit.toString())} 
                onValueChange={(value) =>{
                  console.log("Selected unit:", value.toString())
                  console.log("Selected unit 136:", formData.unit.toString())
                  handleInputChange('unit', value.toString())
                }
              } 
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unit.map((rate) => (
                    <SelectItem key={rate} value={rate}>
                      {rate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST Rate (%)</Label>
              <Select 
                value={formData.gst.toString()} 
                onValueChange={(value) => handleInputChange('gst', Number(parseInt(value)))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select GST rate" />
                </SelectTrigger>
                <SelectContent>
                  {gstRates.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {rate}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            
            
          </div>

          {/* Responsive grid for GST and category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            
            <div className="space-y-2">
              <Label htmlFor="kgpunit">Kg's in 1 {formData.unit}</Label>
              <Input
                id="kgpunit"
                type="number"
                step="0.1"
                min="0"
                value={formData.kgpunit}
                onChange={(e) => handleInputChange('kgpunit', parseFloat(e.target.value) || "")}
                // placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
            {product && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}  