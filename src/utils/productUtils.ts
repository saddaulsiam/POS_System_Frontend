import { Product, ProductVariant } from "../types";
import { productsAPI, productVariantsAPI } from "../services";

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

  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow;
  if (!iframeWindow) {
    document.body.removeChild(iframe);
    return;
  }

  const renderDocument = (barcodeImageSrc: string) => {
    const labels = Array.from(
      { length: Math.max(1, copies) },
      () => `
      <section class="barcode-label" aria-label="${escapeHtml(product.name)} label">
        ${showProductName ? `<div class="label-name">${escapeHtml(product.name)}</div>` : ""}
        
        <div class="barcode-container">
          <img src="${barcodeImageSrc}" alt="Barcode for ${escapeHtml(product.name)}" class="barcode-image"/>
        </div>
        
        <div class="label-footer">
          <div class="footer-left">
            ${showSku ? `<div class="label-sku">SKU: ${escapeHtml(product.sku)}</div>` : ""}
            ${showBarcodeText ? `<div class="barcode-text">${escapeHtml(barcodeValue)}</div>` : ""}
          </div>
          ${showPrice ? `<div class="label-price">${formatCurrency(product.sellingPrice)}</div>` : ""}
        </div>
      </section>
    `,
    ).join("");

    const sheetClass = config.isSheet ? "sheet-layout" : "thermal-layout";

    iframeWindow.document.write(`
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
                border: 1px dashed #9ca3af;
                padding: 1.5mm 2mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                page-break-inside: avoid;
                break-inside: avoid;
                box-sizing: border-box;
              }

              .label-name {
                text-align: center;
                font-size: ${7.5 * config.fontScale}pt;
                font-weight: 800;
                color: #000;
                text-transform: uppercase;
                line-height: 1.1;
                max-height: 2.2em;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                border-bottom: 0.2mm solid #e5e7eb;
                padding-bottom: 0.5mm;
                margin-bottom: 0.5mm;
              }

              .barcode-container {
                text-align: center;
                background: white;
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.5mm 0;
                overflow: hidden;
              }

              .barcode-image {
                max-width: 100%;
                max-height: 100%;
                height: auto;
                object-fit: contain;
              }

              .label-footer {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                border-top: 0.2mm solid #e5e7eb;
                padding-top: 0.5mm;
                margin-top: 0.5mm;
                gap: 1mm;
              }

              .footer-left {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-end;
                line-height: 1.1;
              }

              .label-sku {
                font-size: ${5.5 * config.fontScale}pt;
                font-weight: 600;
                color: #4b5563;
                text-transform: uppercase;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 25mm;
              }

              .barcode-text {
                font-family: 'Courier New', monospace;
                font-size: ${5 * config.fontScale}pt;
                font-weight: 700;
                color: #000;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 25mm;
              }

              .label-price {
                color: #000;
                font-size: ${9.5 * config.fontScale}pt;
                font-weight: 900;
                text-align: right;
                white-space: nowrap;
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
                    // Signal to parent window to remove the iframe
                    window.parent.postMessage('print-complete', '*');
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
    iframeWindow.document.close();
  };

  const cleanup = () => {
    try {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    } catch {}
    window.removeEventListener("message", handleMessage);
  };

  const handleMessage = (event: MessageEvent) => {
    if (event.data === "print-complete") {
      cleanup();
    }
  };

  window.addEventListener("message", handleMessage);

  // Safety cleanup timeout
  setTimeout(cleanup, 60000);

  void productsAPI
    .getBarcodeImage(product.id)
    .then((barcodeImageSrc) => renderDocument(barcodeImageSrc))
    .catch(() => renderDocument(""));
};

export const printVariantBarcodeLabel = (
  variant: ProductVariant & { product: Product },
  copies: number = 1,
  options: BarcodePrintOptions = {},
) => {
  const template = options.template || "thermal-40x30";
  const config = templateConfig[template];
  const barcodeValue = variant.barcode || variant.sku || variant.product.barcode || variant.product.sku || String(variant.product.id);
  const showProductName = options.showProductName ?? true;
  const showSku = options.showSku ?? true;
  const showPrice = options.showPrice ?? true;
  const showBarcodeText = options.showBarcodeText ?? true;

  const fullName = `${variant.product.name} - ${variant.name}`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow;
  if (!iframeWindow) {
    document.body.removeChild(iframe);
    return;
  }

  const renderDocument = (barcodeImageSrc: string) => {
    const labels = Array.from(
      { length: Math.max(1, copies) },
      () => `
      <section class="barcode-label" aria-label="${escapeHtml(fullName)} label">
        ${showProductName ? `<div class="label-name">${escapeHtml(fullName)}</div>` : ""}
        
        <div class="barcode-container">
          <img src="${barcodeImageSrc}" alt="Barcode for ${escapeHtml(fullName)}" class="barcode-image"/>
        </div>
        
        <div class="label-footer">
          <div class="footer-left">
            ${showSku ? `<div class="label-sku">SKU: ${escapeHtml(variant.sku)}</div>` : ""}
            ${showBarcodeText ? `<div class="barcode-text">${escapeHtml(barcodeValue)}</div>` : ""}
          </div>
          ${showPrice ? `<div class="label-price">${formatCurrency(variant.sellingPrice)}</div>` : ""}
        </div>
      </section>
    `,
    ).join("");

    const sheetClass = config.isSheet ? "sheet-layout" : "thermal-layout";

    iframeWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode Labels - ${fullName}</title>
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
                border: 1px dashed #9ca3af;
                padding: 1.5mm 2mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                page-break-inside: avoid;
                break-inside: avoid;
                box-sizing: border-box;
              }

              .label-name {
                text-align: center;
                font-size: ${7.5 * config.fontScale}pt;
                font-weight: 800;
                color: #000;
                text-transform: uppercase;
                line-height: 1.1;
                max-height: 2.2em;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                border-bottom: 0.2mm solid #e5e7eb;
                padding-bottom: 0.5mm;
                margin-bottom: 0.5mm;
              }

              .barcode-container {
                text-align: center;
                background: white;
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.5mm 0;
                overflow: hidden;
              }

              .barcode-image {
                max-width: 100%;
                max-height: 100%;
                height: auto;
                object-fit: contain;
              }

              .label-footer {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                border-top: 0.2mm solid #e5e7eb;
                padding-top: 0.5mm;
                margin-top: 0.5mm;
                gap: 1mm;
              }

              .footer-left {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-end;
                line-height: 1.1;
              }

              .label-sku {
                font-size: ${5.5 * config.fontScale}pt;
                font-weight: 600;
                color: #4b5563;
                text-transform: uppercase;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 25mm;
              }

              .barcode-text {
                font-family: 'Courier New', monospace;
                font-size: ${5 * config.fontScale}pt;
                font-weight: 700;
                color: #000;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 25mm;
              }

              .label-price {
                color: #000;
                font-size: ${9.5 * config.fontScale}pt;
                font-weight: 900;
                text-align: right;
                white-space: nowrap;
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
                    // Signal to parent window to remove the iframe
                    window.parent.postMessage('print-complete', '*');
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
    iframeWindow.document.close();
  };

  const cleanup = () => {
    try {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    } catch {}
    window.removeEventListener("message", handleMessage);
  };

  const handleMessage = (event: MessageEvent) => {
    if (event.data === "print-complete") {
      cleanup();
    }
  };

  window.addEventListener("message", handleMessage);

  // Safety cleanup timeout
  setTimeout(cleanup, 60000);

  void productVariantsAPI
    .getBarcodeImage(variant.id)
    .then((barcodeImageSrc) => renderDocument(barcodeImageSrc))
    .catch(() => renderDocument(""));
};
