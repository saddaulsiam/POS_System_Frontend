// Helper functions for alignment and spacing
function padRight(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) : str.padEnd(length, " ");
}

function padLeft(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) : str.padStart(length, " ");
}

function center(str: string, width: number): string {
  if (width <= str.length) return str;
  const padding = Math.floor((width - str.length) / 2);
  return " ".repeat(padding) + str;
}

function formatLine(label: string, value: string, width: number): string {
  const maxLabelLength = Math.max(0, width - value.length);
  return padRight(label, maxLabelLength) + value;
}

function wrapText(str: string, maxLen: number): string[] {
  if (!str) return [""];
  const words = String(str).split(/\s+/);
  const lines: string[] = [];
  let current = "";
  words.forEach((w) => {
    if ((current + " " + w).trim().length > maxLen) {
      if (current.trim().length > 0) lines.push(current.trim());
      if (w.length > maxLen) {
        let i = 0;
        while (i < w.length) {
          lines.push(w.substring(i, i + maxLen));
          i += maxLen;
        }
        current = "";
      } else {
        current = w;
      }
    } else {
      current = (current + " " + w).trim();
    }
  });
  if (current) lines.push(current.trim());
  return lines.length ? lines : [""];
}

// Generate raw content for standard thermal ESC/POS printing
export function generateThermalReceipt(saleData: any, settings: any = {}): string {
  const currency = settings.currencySymbol || "$";
  const width = 48; // Standard 80mm column width
  let receipt = "";

  const storeName = settings.storeName || "POS System";
  const address = settings.storeAddress || "123 Main St, City";
  const phone = settings.storePhone || "(123) 456-7890";
  const taxId = settings.taxId;

  // Header
  wrapText(storeName, width).forEach((ln) => (receipt += center(ln, width) + "\n"));
  wrapText(address, width).forEach((ln) => (receipt += center(ln, width) + "\n"));
  wrapText(`Phone: ${phone}`, width).forEach((ln) => (receipt += center(ln, width) + "\n"));
  if (taxId) wrapText(`Tax ID: ${taxId}`, width).forEach((ln) => (receipt += center(ln, width) + "\n"));
  receipt += "=".repeat(width) + "\n";

  // Receipt Info
  receipt += `Receipt #: ${saleData.receiptId}\n`;
  receipt += `Date: ${new Date(saleData.createdAt).toLocaleDateString()}\n`;
  receipt += `Time: ${new Date(saleData.createdAt).toLocaleTimeString()}\n`;
  receipt += `Cashier: ${saleData.employeeName}\n`;
  if (saleData.customerName) receipt += `Customer: ${saleData.customerName}\n`;
  receipt += "-".repeat(width) + "\n";

  // Item List Header
  const nameWidth = 30;
  const qtyWidth = 10;
  const totalWidth = width - nameWidth - qtyWidth;
  receipt += padRight("Item", nameWidth) + padRight("Qty", qtyWidth) + padLeft("Total", totalWidth) + "\n";
  receipt += "-".repeat(width) + "\n";

  // Items
  saleData.items.forEach((item: any) => {
    const itemName = item.variantName ? `${item.productName} - ${item.variantName}` : item.productName;
    const nameStr = padRight(itemName, nameWidth);
    const qtyStr = padRight(`${item.price.toFixed(2)} x ${item.quantity}`, qtyWidth);
    const totalStr = padLeft(`${currency}${item.subtotal.toFixed(2)}`, totalWidth);
    receipt += nameStr + qtyStr + totalStr + "\n";
  });

  receipt += "\n" + "-".repeat(width) + "\n";

  // Totals
  receipt += formatLine("Subtotal:", `${currency}${saleData.subtotal.toFixed(2)}`, width) + "\n";
  if (saleData.loyaltyDiscount > 0) {
    receipt += formatLine("Loyalty Discount:", `(-)${currency}${saleData.loyaltyDiscount.toFixed(2)}`, width) + "\n";
  }
  if (saleData.offerDiscount > 0) {
    receipt += formatLine("Offer Discount:", `(-)${currency}${saleData.offerDiscount.toFixed(2)}`, width) + "\n";
  }
  receipt += formatLine("Tax:", `${currency}${saleData.taxAmount.toFixed(2)}`, width) + "\n";
  receipt += "-".repeat(width) + "\n";
  receipt += formatLine("TOTAL:", `${currency}${saleData.finalAmount.toFixed(2)}`, width) + "\n";
  receipt += "=".repeat(width) + "\n";

  // Payment
  receipt += formatLine(`PAID (${saleData.paymentMethod}):`, `${currency}${saleData.finalAmount.toFixed(2)}`, width) + "\n";
  if (saleData.paymentMethod === "CASH" && saleData.cashReceived != null) {
    receipt += formatLine("Cash Received:", `${currency}${saleData.cashReceived.toFixed(2)}`, width) + "\n";
    receipt += formatLine("Change Given:", `${currency}${saleData.changeGiven.toFixed(2)}`, width) + "\n";
  }

  // Footer
  receipt += "\n" + center(settings.receiptFooterText || "Thank you for shopping with us!", width) + "\n\n\n";
  return receipt;
}

// Generate the HTML code for dynamic web printing
export function generateHTMLReceipt(saleData: any, settings: any = {}): string {
  const currency = settings.currencySymbol || "$";
  const receiptDate = new Date(saleData.createdAt);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt #${saleData.receiptId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin: 0; padding: 10px; color: #222; }
    .store-header { text-align: center; max-width: 700px; margin: 0 auto 8px auto; word-wrap: break-word; white-space: normal; }
    .store-header .name { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .store-header .meta { font-size: 12px; color: #444; }
    .receipt-info { margin: 12px 0; font-size: 13px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .items-table th, .items-table td { padding: 6px 8px; border-bottom: 1px solid #eee; }
    .items-table th { text-align: left; font-weight: 600; }
    .totals { max-width: 420px; margin-left: auto; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .totals-label { color: #333; }
    .total-final { font-size: 16px; font-weight: 700; }
    .footer { text-align: center; margin-top: 14px; font-size: 13px; }
    @media print {
      body { margin: 0; }
      .store-header .name { font-size: 18px; }
    }
  </style>
</head>
<body>
  <div class="store-header">
    <div class="name">${settings.storeName || "POS System"}</div>
    <div class="meta">
      ${settings.storeAddress || "123 Main St, City, Country"}<br>
      Phone: ${settings.storePhone || "(123) 456-7890"}
      ${settings.taxId ? `<br>Tax ID: ${settings.taxId}` : ""}
    </div>
  </div>

  <div class="receipt-info">
    <strong>Receipt #${saleData.receiptId}</strong><br>
    Date: ${receiptDate.toLocaleDateString()} ${receiptDate.toLocaleTimeString()}<br>
    Cashier: ${saleData.employeeName}<br>
    Customer: ${saleData.customerName || "N/A"}<br>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${saleData.items
      .map((item: any) => {
        const itemName = item.variantName
          ? `${item.productName} - ${item.variantName}`
          : item.productName;
        return `
        <tr>
          <td>${itemName}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${currency}${item.price.toFixed(2)}</td>
          <td style="text-align: right;">${currency}${item.subtotal.toFixed(2)}</td>
        </tr>
        `;
      })
      .join("")}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <div class="totals-label">Subtotal:</div>
      <div>${currency}${saleData.subtotal.toFixed(2)}</div>
    </div>
    ${saleData.loyaltyDiscount > 0
      ? `
    <div class="totals-row">
      <div class="totals-label">Loyalty Discount:</div>
      <div>-${currency}${saleData.loyaltyDiscount.toFixed(2)}</div>
    </div>
    `
      : ""
    }
    ${saleData.offerDiscount > 0
      ? `
    <div class="totals-row">
      <div class="totals-label">Offer Discount:</div>
      <div>-${currency}${saleData.offerDiscount.toFixed(2)}</div>
    </div>
    `
      : ""
    }
    <div class="totals-row">
      <div class="totals-label">Tax:</div>
      <div>${currency}${saleData.taxAmount.toFixed(2)}</div>
    </div>
    <div class="totals-row total-final">
      <div class="totals-label">TOTAL:</div>
      <div>${currency}${saleData.finalAmount.toFixed(2)}</div>
    </div>
  </div>

  <div class="footer">
    <p><strong>${settings.receiptFooterText || "Thank you for shopping with us!"}</strong></p>
    <p>Please keep this receipt for your records</p>
  </div>
</body>
</html>
  `.trim();
}
