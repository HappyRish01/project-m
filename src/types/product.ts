export interface Product {
  id: string;
  name: string;
  price: number ; // Allow string for compatibility with form inputs
  hsnCode: string;
  kgpunit: number ;
  gst: number;
  unit: string;
  type?: string
}