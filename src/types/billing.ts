export interface BillingDetails {
  date: string ;
  customerName: string
  address: string
  city: string
  pinCode: string
  country: string
  panNumber: string
  gstinNumber: string;
  vehicleNumber?: string
  stateCode?: string
  state?: string
  billNumber?: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  hsnCode: string
  gst: number
  kgpunit: number
  unit: string
}
