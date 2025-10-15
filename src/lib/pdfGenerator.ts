import { supabase } from "@/integrations/supabase/client";

interface InvoiceItem {
  product: {
    product_name: string;
    price: number;
  };
  quantity: number;
}

interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;
  items: InvoiceItem[];
  total: number;
}

export const generateInvoicePDF = async (data: InvoiceData) => {
  // Get business info
  const { data: businessInfo } = await supabase
    .from("business_info")
    .select("*")
    .limit(1)
    .maybeSingle();

  // Create a new window for the invoice
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Could not open print window");
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          padding-bottom: 30px;
          border-bottom: 3px solid #6366f1;
          margin-bottom: 30px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo {
          max-width: 80px;
          max-height: 80px;
        }
        .company-info h1 {
          color: #6366f1;
          font-size: 24px;
          margin-bottom: 5px;
        }
        .company-info p {
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h2 {
          font-size: 32px;
          color: #6366f1;
          margin-bottom: 10px;
        }
        .invoice-title p {
          color: #666;
          font-size: 14px;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .info-box h3 {
          color: #6366f1;
          font-size: 14px;
          text-transform: uppercase;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }
        .info-box p {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        thead {
          background: #6366f1;
          color: white;
        }
        th {
          padding: 15px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        td {
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
          color: #666;
          font-size: 14px;
        }
        tbody tr:hover {
          background: #f9fafb;
        }
        .text-right {
          text-align: right;
        }
        .totals {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
        }
        .totals-box {
          width: 300px;
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 16px;
        }
        .total-row.grand-total {
          border-top: 2px solid #6366f1;
          padding-top: 15px;
          margin-top: 10px;
          font-weight: bold;
          font-size: 20px;
          color: #6366f1;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6366f1;
          font-size: 16px;
          font-style: italic;
        }
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo-section">
            ${businessInfo?.logo_url ? `<img src="${businessInfo.logo_url}" alt="Logo" class="logo" />` : ""}
            <div class="company-info">
              <h1>${businessInfo?.business_name || "Your Business"}</h1>
              <p>${businessInfo?.business_address || ""}</p>
            </div>
          </div>
          <div class="invoice-title">
            <h2>INVOICE</h2>
            <p><strong>#${data.invoiceNumber}</strong></p>
            <p>Date: ${currentDate}</p>
          </div>
        </div>

        <div class="info-section">
          <div class="info-box">
            <h3>Bill To:</h3>
            <p>
              <strong>${data.customerName}</strong><br>
              ${data.customerAddress ? `${data.customerAddress}<br>` : ""}
              ${data.customerEmail ? `${data.customerEmail}<br>` : ""}
              ${data.customerPhone}
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Rate</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item) => `
              <tr>
                <td>${item.product.product_name}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">₹${item.product.price.toFixed(2)}</td>
                <td class="text-right">₹${(item.product.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-box">
            <div class="total-row grand-total">
              <span>Grand Total</span>
              <span>₹${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          Thank you for your business!
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
