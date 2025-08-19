import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import PDFDocument from "pdfkit";
import { format } from "date-fns";
import path from "path";
import { numberToWords } from "@/lib/server/numberToWord";
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}
export async function POST(req: Request) {
  const { billId } = await req.json();
  const data = await prisma.bill.findUnique({
    where: {
      id: Number(billId),
    },
    include: {
      items: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Bills not found ", status: 404 });
  }

  try {
    const doc = new PDFDocument({ size: "A4", margin: 30 });
    let buffers: Uint8Array[] = [];
    doc.on("data", buffers.push.bind(buffers));
    return await new Promise<NextResponse>((resolve) => {
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(
          new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename=bill-${data.id}.pdf`,
            },
          })
        );
      });

      // Set monospaced font for exact column alignment
      // doc.font("Courier").fontSize(10);
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "CourierPrime-Bold.ttf"
      );
      doc.font(fontPath).fontSize(10);

      // ===== HEADER =====
      doc.font("Courier").fontSize(10);
      doc.text("BILL OF SUPPLY", { align: "center" });
      doc.moveDown(0.5);
      doc.text(
        "-----------------------------------------------------------------------------------------",
        { align: "center" }
      );
      doc.text("LAKHOTIA AGRO FOODS INDIA", { align: "center" });
      doc.text("2513/7,GALI LALTEN WALI,", { align: "center" });
      doc.text("NAYA BAZAR,DELHI-110006", { align: "center" });
      doc.text("FSSAI NO.:13319001000678", { align: "center" });
      doc.text("PAN NO. :AJDPM4402A", { align: "center" });

      doc.text(
        "-----------------------------------------------------------------------------------------",
        { align: "center" }
      );
      doc.text(
        "GSTIN :07AJDPM4402A1ZX                                                  Ph no.:9868767042",
        {
          align: "center",
        }
      );
      doc.text(
        "State :DELHI                                                                    ",
        { align: "left" }
      );
      doc.text(
        "State code :07                                                                      Res.:",
        { align: "center" }
      );
      doc.text(
        "-----------------------------------------------------------------------------------------",
        { align: "center" }
      );

      // ===== BILL INFO =====
      const billDate = format(new Date(data.date), "dd/MM/yyyy");
      doc.text(
        `Bill No. :${data.id}                                                           Date :${billDate}`,
        { align: "left" }
      );
      doc.text(
        "-----------------------------------------------------------------------------------------",
        { align: "center" }
      );
      doc.text(`M/s          : ${data.name}`, { align: "left" });
      doc.text(`             : ${data.address}`);
      doc.text(`             : ${data.city}`);
      doc.text(`Pan no       : ${data.panNumber}`);
      doc.text(
        `State        : ${data.state}                                         State Code:${data.stateCode}`
      );
      doc.text(`GSTIN        : ${data.GSTINumber}`);
      doc.text(
        "-----------------------------------------------------------------------------------------"
      );

      // ===== TABLE HEADER =====
      doc.text(
        "Item              Hsn Code       Qty.    Unit       Weight        Rate        Amount"
      );
      doc.text(
        "                                                    per(kg)      per(qtl)"
      );
      doc.text(
        "-----------------------------------------------------------------------------------------"
      );

      // ===== TABLE ROWS =====
      let totalQty = 0;
      let totalGWeight = 0;
      let totalAmount = 0;


      data.items.forEach((item: any) => {
        const truncatedName = truncateText(item.name, 15);
        const truncatedUnit = truncateText(item.unit, 4);
        const amount = item.price / 100;
        const weight = item.quantity * item.kgpunit;

        const line = `${truncatedName.padEnd(17)} ${item.hsnCode.padEnd(
          15
        )} ${String(item.quantity).padEnd(6)} ${truncatedUnit.padEnd(
          11
        )} ${String(weight.toFixed(2)).padEnd(11)} ${String(
          item.price.toFixed(2)
        ).padEnd(11)} ${String((amount * weight).toFixed(2))}`;

        doc.text(line, {
          align: "left",
        });
        doc.moveDown(0.35);

        totalQty += item.qty;
        totalGWeight += item.gWeight;
        totalAmount += item.amount;
      });

      doc.moveDown(6);
      doc.text(
        "-----------------------------------------------------------------------------------------"
      );
      // AMOUNT AND GST
      doc.text(
        `                                                         Sub Total : ${data.subTotal?.toFixed(
          2
        )}`,
        {
          align: "center",
        }
      );
      doc.moveDown(0.15);

      // GST Breakdown
      if (data.gstBreakdown) {
        Object.entries(data.gstBreakdown).forEach(
          ([rate, value]: [string, any]) => {
            if (data.state === "DELHI") {
              const half = Number(value) / 2;

              doc.text(
                `                                                        CGST @ ${(
                  Number(rate) / 2
                ).toFixed(1)}% : ${half.toFixed(2)}`,
                {
                  align: "center",
                }
              );
              doc.text(
                `                                                        SGST @ ${(
                  Number(rate) / 2
                ).toFixed(1)}% : ${half.toFixed(2)}`,
                {
                  align: "center",
                }
              );
            } else {
              doc.text(
                `                                                        GST @ ${rate}% : ${Number(
                  value
                ).toFixed(2)}`,
                {
                  align: "center",
                }
              );
            }
          }
        );
      }

      doc.moveDown(0.15);
      // Total GST
      doc.text(
        `                                                        Total GST : ${data.totalGst?.toFixed(
          2
        )}`,
        {
          align: "center",
        }
      );

      doc.moveDown(0.15);
      // Grand Total
      doc.text(
        `                                                       Grand Total : ${data.totalAmount.toFixed(
          2
        )}`,
        {
          align: "center",
        }
      );
      doc.moveDown(0.15);

      doc.text(
        "-----------------------------------------------------------------------------------------"
      );

      //AMPUNT IN WORD
      doc.text(numberToWords(data.totalAmount));
      doc.text(
        "-----------------------------------------------------------------------------------------"
      );
      //BANK
      doc.text(
        `HDFC BANK LTD. KAMLA NAGAR DELHI-7 ,  A/C NO.  50200041959560  IFSC  CODE  HDFC0001439`
      );

      doc.text(
        "-----------------------------------------------------------------------------------------"
      );

      doc.text(
        "E.& O.E.                                                 for LAKHOTIA AGRO FOODS INDIA"
      );
      doc.moveDown(2);
      doc.text(`Vehicle Number   :   ${data.vehicleNumber}`);
      doc.moveDown(5);
      doc.text(
        "All Subject To Delhi Jurisdiction                                Authorised Signatory"
      );
      doc.end();
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
