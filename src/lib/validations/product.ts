import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().positive("Price must be greater than 0"),
    hsnCode: z.string().min(1, "HSN Code is required"),
    gst: z.number().int(),
    kgpunit: z.number().positive("KGP Unit must be greater than 0"),
      unit: z.enum(["Kata", "Bag", "Peti"], { message: "Unit must be Kata or Bag or Peti" }),
    })

export const productUpdateSchema = productSchema.partial()

export type ProductInput = z.infer<typeof productSchema>
