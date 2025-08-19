"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/CartProvider";

export function CartItemList() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No items in cart</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {items.map((item) => {

        return (
          <Card key={item.id} className="border border-gray-200">
            <CardContent className="-py-4">
              <div className="flex items-start justify-between">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Quantity: <span>{item.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    GST: <span>{item.gst}%</span>
                  </p>

                  <p className="text-sm text-gray-600">
                    Price Each per (qtl): ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  {/* Right */}

                  {/* weight */}
                  <p className="font-medium text-gray-900">
                    Subtotal: ₹{(((item.price * item.quantity) / 100) * item.kgpunit).toFixed(2)}
                  </p>
                  <p className="text-sm">
                    GST ({item.gst}%): ₹{(( ((item.price * item.quantity)/100) * item.kgpunit* item.gst) / 100).toFixed(2)}
                    {/* GST ({item.gst}%): ₹{gstOnSubtotal} */}
                  </p>
                  <p className="text-sm">
                    {`${item.kgpunit} kg in 1 ${item.unit}`}
                  </p>
                  <p className="font-semibold text-green-700">
                    {/* Total: ₹{(item.price * item.quantity + (item.price * item.quantity * item.gst) / 100).toFixed(2)} */}
                    Total: ₹{(((((item.price * item.quantity) / 100) * item.kgpunit)) + ((( ((item.price * item.quantity)/100) * item.kgpunit* item.gst) / 100))).toFixed(2)}
                  </p>

                  {/* <p className="text-sm text-gray-600">₹{item.price} each</p> */}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
