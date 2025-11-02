import { Product } from "../types";
import { productsAPI } from "../services";

/**
 * Print barcode labels for a product
 * @param product - The product to print labels for
 * @param copies - Number of labels to print (default: 1)
 */
export const printBarcodeLabel = (product: Product, copies: number = 1) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    const labels = Array(copies)
      .fill(null)
      .map(
        () => `
        <div class="barcode-label">
          <div class="label-header">
            <h3>${product.name}</h3>
          </div>
          <div class="label-info">
            <div class="info-row">
              <span class="label">SKU:</span>
              <span class="value">${product.sku}</span>
            </div>
            <div class="info-row">
              <span class="label">Price:</span>
              <span class="value price">$${product.sellingPrice.toFixed(2)}</span>
            </div>
          </div>
          <div class="barcode-container">
            <img src="${productsAPI.getBarcodeImage(product.id)}" alt="Barcode" class="barcode-image"/>
          </div>
          <div class="barcode-text">${product.barcode}</div>
        </div>
      `,
      )
      .join("");

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode Labels - ${product.name}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              body {
                font-family: 'Arial', sans-serif;
                padding: 8mm;
                background: white;
              }

              .labels-container {
                display: flex;
                flex-wrap: wrap;
                gap: 4mm;
                justify-content: flex-start;
                align-content: flex-start;
              }

              .barcode-label {
                width: 60mm;
                height: 42mm;
                border: 1.5px solid #333;
                padding: 2mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                page-break-inside: avoid;
              }

              .label-header {
                text-align: center;
                border-bottom: 1px solid #333;
                padding-bottom: 1mm;
                margin-bottom: 1mm;
              }

              .label-header h3 {
                font-size: 9pt;
                font-weight: bold;
                color: #333;
                text-transform: uppercase;
                word-wrap: break-word;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .label-info {
                margin-bottom: 1mm;
              }

              .info-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5mm 0;
                font-size: 8pt;
              }

              .info-row .label {
                font-weight: bold;
                color: #666;
              }

              .info-row .value {
                color: #333;
              }

              .info-row .price {
                font-weight: bold;
                font-size: 9pt;
                color: #000;
              }

              .barcode-container {
                text-align: center;
                padding: 1mm 0;
                background: white;
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .barcode-image {
                max-width: 100%;
                max-height: 100%;
                height: auto;
              }

              .barcode-text {
                text-align: center;
                font-family: 'Courier New', monospace;
                font-size: 7pt;
                font-weight: bold;
                letter-spacing: 0.5px;
                color: #333;
                margin-top: 0.5mm;
              }

              @media print {
                @page {
                  size: A4;
                  margin: 8mm;
                }

                body {
                  padding: 0;
                  background: white;
                }

                .labels-container {
                  gap: 4mm;
                }

                .barcode-label {
                  border: 1.5px solid #000;
                  page-break-inside: avoid;
                }

                .labels-container {
                  gap: 5mm;
                }
              }

              @page {
                size: A4;
                margin: 10mm;
              }
            </style>
          </head>
          <body>
            <div class="labels-container">
              ${labels}
            </div>
            <script>
              window.onload = function() {
                const images = document.getElementsByTagName('img');
                let loaded = 0;
                const total = images.length;
                
                if (total === 0) {
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => window.close(), 100);
                  }, 250);
                  return;
                }

                for (let i = 0; i < total; i++) {
                  if (images[i].complete) {
                    loaded++;
                  } else {
                    images[i].onload = function() {
                      loaded++;
                      if (loaded === total) {
                        setTimeout(() => {
                          window.print();
                          setTimeout(() => window.close(), 100);
                        }, 250);
                      }
                    };
                    images[i].onerror = function() {
                      loaded++;
                      if (loaded === total) {
                        setTimeout(() => {
                          window.print();
                          setTimeout(() => window.close(), 100);
                        }, 250);
                      }
                    };
                  }
                }

                if (loaded === total) {
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => window.close(), 100);
                  }, 250);
                }
              }
            </script>
          </body>
        </html>
      `);
    printWindow.document.close();
  }
};
