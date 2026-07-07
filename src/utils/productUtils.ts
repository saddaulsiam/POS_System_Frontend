import { Product } from "../types";
import { productsAPI } from "../services";

export type BarcodeStickerTemplate =
  | "thermal-40x30"
  | "thermal-50x30"
  | "thermal-60x40"
  | "a4-sheet-3x8";

export interface BarcodePrintOptions {
  copies?: number;
  template?: BarcodeStickerTemplate;
  showProductName?: boolean;
  showSku?: boolean;
  showPrice?: boolean;
  showBarcodeText?: boolean;
}

const templateConfig: Record<
  BarcodeStickerTemplate,
  {
    labelWidthMm: number;
    labelHeightMm: number;
    pageSize: string;
    pageMargin: string;
    columns: number;
    rows: number;
    gapMm: number;
    fontScale: number;
    isSheet: boolean;
  }
> = {
  "thermal-40x30": {
    labelWidthMm: 40,
    labelHeightMm: 30,
    pageSize: "40mm 30mm",
    pageMargin: "0",
    columns: 1,
    rows: 1,
    gapMm: 0,
    fontScale: 1,
    isSheet: false,
  },
  "thermal-50x30": {
    labelWidthMm: 50,
    labelHeightMm: 30,
    pageSize: "50mm 30mm",
    pageMargin: "0",
    columns: 1,
    rows: 1,
    gapMm: 0,
    fontScale: 1.05,
    isSheet: false,
  },
  "thermal-60x40": {
    labelWidthMm: 60,
    labelHeightMm: 40,
    pageSize: "60mm 40mm",
    pageMargin: "0",
    columns: 1,
    rows: 1,
    gapMm: 0,
    fontScale: 1.1,
    isSheet: false,
  },
  "a4-sheet-3x8": {
    labelWidthMm: 63.5,
    labelHeightMm: 34,
    pageSize: "A4",
    pageMargin: "6mm",
    columns: 3,
    rows: 8,
    gapMm: 2.5,
    fontScale: 0.95,
    isSheet: true,
  },
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

/**
 * Print barcode labels for a product
 * @param product - The product to print labels for
 * @param copies - Number of labels to print (default: 1)
 */
export const printBarcodeLabel = (
  product: Product,
  copies: number = 1,
  options: BarcodePrintOptions = {},
) => {
  const template = options.template || "thermal-40x30";
  const config = templateConfig[template];
  const barcodeValue = product.barcode || product.sku || String(product.id);
  const showProductName = options.showProductName ?? true;
  const showSku = options.showSku ?? true;
  const showPrice = options.showPrice ?? true;
  const showBarcodeText = options.showBarcodeText ?? true;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const renderDocument = (barcodeImageSrc: string) => {
    const labels = Array.from(
      { length: Math.max(1, copies) },
      () => `
      <section class="barcode-label" aria-label="${escapeHtml(product.name)} label">
        ${showProductName ? `<div class="label-name">${escapeHtml(product.name)}</div>` : ""}
        <div class="label-meta">
          ${showSku ? `<span>SKU: ${escapeHtml(product.sku)}</span>` : ""}
          ${showPrice ? `<span class="label-price">${formatCurrency(product.sellingPrice)}</span>` : ""}
        </div>
        <div class="barcode-container">
          <img src="${barcodeImageSrc}" alt="Barcode for ${escapeHtml(product.name)}" class="barcode-image"/>
        </div>
        ${showBarcodeText ? `<div class="barcode-text">${escapeHtml(barcodeValue)}</div>` : ""}
      </section>
    `,
    ).join("");

    const sheetClass = config.isSheet ? "sheet-layout" : "thermal-layout";

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
                font-family: Inter, Arial, sans-serif;
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              .labels-container {
                display: grid;
                ${config.isSheet ? `grid-template-columns: repeat(${config.columns}, minmax(0, 1fr)); gap: ${config.gapMm}mm;` : "grid-template-columns: 1fr; justify-items: center;"}
                ${config.isSheet ? "" : "justify-content: center; align-content: center;"}
                width: 100%;
                height: 100%;
                gap: ${config.gapMm}mm;
              }

              .thermal-layout {
                width: 100%;
                min-height: 100vh;
                padding: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 0;
              }

              .sheet-layout {
                padding: 0;
              }

              .barcode-label {
                width: ${config.labelWidthMm}mm;
                height: ${config.labelHeightMm}mm;
                border: 1px solid #111827;
                padding: 2mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                page-break-inside: avoid;
                break-inside: avoid;
                border-radius: 1.5mm;
                box-shadow: 0 0 0 0.2mm rgba(17, 24, 39, 0.08);
              }

              .label-name {
                text-align: center;
                font-size: ${9 * config.fontScale}pt;
                font-weight: 800;
                color: #111827;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                line-height: 1.05;
                max-height: 2.2em;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              .label-meta {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2mm;
                font-size: ${7 * config.fontScale}pt;
                font-weight: 700;
                color: #374151;
                line-height: 1;
              }

              .label-price {
                color: #111827;
                font-size: ${8.5 * config.fontScale}pt;
              }

              .info-row .price {
                font-weight: bold;
                font-size: 9pt;
                color: #000;
              }

              .barcode-container {
                text-align: center;
                padding: 1mm 0 0;
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
                font-size: ${6.5 * config.fontScale}pt;
                font-weight: 800;
                letter-spacing: 0.75px;
                color: #111827;
                margin-top: 0.5mm;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              @media print {
                @page {
                  size: ${config.pageSize};
                  margin: ${config.pageMargin};
                }

                body {
                  padding: 0;
                  background: white;
                }

                .${sheetClass} {
                  min-height: auto;
                }

                .barcode-label {
                  box-shadow: none;
                  page-break-inside: avoid;
                  break-inside: avoid;
                }

                .barcode-label + .barcode-label {
                  ${config.isSheet ? "" : "page-break-before: always;"}
                }
              }

              @page {
                size: ${config.pageSize};
                margin: ${config.pageMargin};
              }
            </style>
          </head>
          <body>
            <div class="labels-container ${sheetClass}">
              ${labels}
            </div>
            <script>
              (function() {
                const images = document.getElementsByTagName('img');
                let loaded = 0;
                const total = images.length;
                
                function triggerPrint() {
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => window.close(), 100);
                  }, 250);
                }

                if (total === 0) {
                  triggerPrint();
                  return;
                }

                for (let i = 0; i < total; i++) {
                  if (images[i].complete) {
                    loaded++;
                  } else {
                    images[i].onload = function() {
                      loaded++;
                      if (loaded === total) {
                        triggerPrint();
                      }
                    };
                    images[i].onerror = function() {
                      loaded++;
                      if (loaded === total) {
                        triggerPrint();
                      }
                    };
                  }
                }

                if (loaded === total) {
                  triggerPrint();
                }
              })();
            </script>
          </body>
        </html>
      `);
    printWindow.document.close();
  };

  void productsAPI
    .getBarcodeImage(product.id)
    .then((barcodeImageSrc) => renderDocument(barcodeImageSrc))
    .catch(() => renderDocument(""));
};
