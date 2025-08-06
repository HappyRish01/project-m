import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/types/product" // Import Product type

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: number) => void
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2"> {/* Responsive name/badge layout */}
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {product.category}
                  </Badge>
                </div>
                
                {/* Responsive grid for product details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Price:</span> ₹{product.price}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span> {product.stock}
                  </div>
                  <div>
                    <span className="font-medium">HSN:</span> {product.hsnCode}
                  </div>
                  <div>
                    <span className="font-medium">GST:</span> {product.gst}%
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(product.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No products found. Add your first product to get started.</p>
        </div>
      )}
    </div>
  )
}
