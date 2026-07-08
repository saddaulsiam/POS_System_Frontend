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

// ─────────────────────────────────────────────────────────────────────────────
// Shared CSS builder
// ─────────────────────────────────────────────────────────────────────────────
const buildLabelStyles = (
  config: (typeof templateConfig)[BarcodeStickerTemplate],
  sheetClass: string,
) => `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: Inter, Arial, sans-serif;
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .labels-container {
    display: grid;
    ${config.isSheet
      ? `grid-template-columns: repeat(${config.columns}, minmax(0, 1fr)); gap: ${config.gapMm}mm;`
      : "grid-template-columns: 1fr; justify-items: center; justify-content: center; align-content: center;"}
    width: 100%;
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

  .sheet-layout { padding: 0; }

  .barcode-label {
    width: ${config.labelWidthMm}mm;
    height: ${config.labelHeightMm}mm;
    border: 1px dashed #9ca3af;
    padding: 1.5mm 1.5mm;
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

    body { padding: 0; background: white; }

    .${sheetClass} { min-height: auto; }

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
`;

// ─────────────────────────────────────────────────────────────────────────────
// Core print engine — works in both browsers AND Electron
//
// Strategy: inject a hidden #__barcode-print-root <div> into the main document.
// A <style> tag uses @media print to hide everything else and show only this
// div. window.print() is called on the MAIN window (not an iframe), so Electron
// renders the preview correctly.
// ─────────────────────────────────────────────────────────────────────────────
const PRINT_ROOT_ID = "__barcode-print-root";
const PRINT_STYLE_ID = "__barcode-print-style";

const executePrint = (
  labelsHtml: string,
  config: (typeof templateConfig)[BarcodeStickerTemplate],
  sheetClass: string,
  title: string,
) => {
  // Remove any leftover print elements from a previous call
  document.getElementById(PRINT_ROOT_ID)?.remove();
  document.getElementById(PRINT_STYLE_ID)?.remove();

  // ── 1. Inject the print-only CSS into the main document ──
  const styleEl = document.createElement("style");
  styleEl.id = PRINT_STYLE_ID;
  styleEl.textContent = `
    /* Hide everything during print except our label root */
    @media print {
      body > *:not(#${PRINT_ROOT_ID}) { display: none !important; }
      #${PRINT_ROOT_ID} { display: block !important; }
    }

    /* The label root itself is always hidden on screen */
    #${PRINT_ROOT_ID} {
      display: none;
      position: fixed;
      inset: 0;
      background: white;
      z-index: 99999;
    }

    /* Scoped label styles */
    #${PRINT_ROOT_ID} .print-doc {
      ${buildLabelStyles(config, sheetClass)}
    }
  `;
  document.head.appendChild(styleEl);

  // ── 2. Inject the label markup ──
  const root = document.createElement("div");
  root.id = PRINT_ROOT_ID;
  root.innerHTML = `
    <div class="print-doc">
      <style>${buildLabelStyles(config, sheetClass)}</style>
      <div class="labels-container ${sheetClass}">
        ${labelsHtml}
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // ── 3. Wait for images to fully load, then print from the MAIN window ──
  const images = root.querySelectorAll<HTMLImageElement>("img");
  let loaded = 0;
  const total = images.length;

  const cleanup = () => {
    document.getElementById(PRINT_ROOT_ID)?.remove();
    document.getElementById(PRINT_STYLE_ID)?.remove();
  };

  const doprint = () => {
    // Give browser/Electron one animation frame to render
    requestAnimationFrame(() => {
      setTimeout(() => {
        const savedTitle = document.title;
        document.title = title;
        window.print();
        document.title = savedTitle;
        // Slight delay so Electron captures the page before we remove elements
        setTimeout(cleanup, 1000);
      }, 150);
    });
  };

  if (total === 0) {
    doprint();
    return;
  }

  const onLoad = () => {
    loaded++;
    if (loaded === total) doprint();
  };

  images.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    }
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Build label HTML string (shared between product + variant)
// ─────────────────────────────────────────────────────────────────────────────
interface LabelData {
  name: string;
  sku: string;
  barcodeValue: string;
  sellingPrice: number;
  barcodeImageSrc: string;
  showProductName: boolean;
  showSku: boolean;
  showPrice: boolean;
  showBarcodeText: boolean;
  copies: number;
}

const buildLabelsHtml = (data: LabelData): string =>
  Array.from({ length: Math.max(1, data.copies) }, () =>
    `<section class="barcode-label" aria-label="${escapeHtml(data.name)} label">
      ${data.showProductName ? `<div class="label-name">${escapeHtml(data.name)}</div>` : ""}
      <div class="barcode-container">
        <img src="${data.barcodeImageSrc}" alt="Barcode for ${escapeHtml(data.name)}" class="barcode-image"/>
      </div>
      <div class="label-footer">
        <div class="footer-left">
          ${data.showSku ? `<div class="label-sku">SKU: ${escapeHtml(data.sku)}</div>` : ""}
          ${data.showBarcodeText ? `<div class="barcode-text">${escapeHtml(data.barcodeValue)}</div>` : ""}
        </div>
        ${data.showPrice ? `<div class="label-price">${formatCurrency(data.sellingPrice)}</div>` : ""}
      </div>
    </section>`
  ).join("");

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Print barcode labels for a product.
 * Works in browsers AND Electron (no iframe needed).
 */
export const printBarcodeLabel = (
  product: Product,
  copies: number = 1,
  options: BarcodePrintOptions = {},
) => {
  const template = options.template || "thermal-40x30";
  const config = templateConfig[template];
  const sheetClass = config.isSheet ? "sheet-layout" : "thermal-layout";

  const labelData: Omit<LabelData, "barcodeImageSrc"> = {
    name: product.name,
    sku: product.sku,
    barcodeValue: product.barcode || product.sku || String(product.id),
    sellingPrice: product.sellingPrice,
    showProductName: options.showProductName ?? true,
    showSku: options.showSku ?? true,
    showPrice: options.showPrice ?? true,
    showBarcodeText: options.showBarcodeText ?? true,
    copies,
  };

  void productsAPI
    .getBarcodeImage(product.id)
    .then((src) => {
      executePrint(
        buildLabelsHtml({ ...labelData, barcodeImageSrc: src }),
        config,
        sheetClass,
        `Barcode Labels – ${product.name}`,
      );
    })
    .catch(() => {
      executePrint(
        buildLabelsHtml({ ...labelData, barcodeImageSrc: "" }),
        config,
        sheetClass,
        `Barcode Labels – ${product.name}`,
      );
    });
};

/**
 * Print barcode labels for a product variant.
 * Works in browsers AND Electron (no iframe needed).
 */
export const printVariantBarcodeLabel = (
  variant: ProductVariant & { product: Product },
  copies: number = 1,
  options: BarcodePrintOptions = {},
) => {
  const template = options.template || "thermal-40x30";
  const config = templateConfig[template];
  const sheetClass = config.isSheet ? "sheet-layout" : "thermal-layout";

  const labelData: Omit<LabelData, "barcodeImageSrc"> = {
    name: variant.name,
    sku: variant.sku,
    barcodeValue:
      variant.barcode ||
      variant.sku ||
      variant.product.barcode ||
      variant.product.sku ||
      String(variant.product.id),
    sellingPrice: variant.sellingPrice,
    showProductName: options.showProductName ?? true,
    showSku: options.showSku ?? true,
    showPrice: options.showPrice ?? true,
    showBarcodeText: options.showBarcodeText ?? true,
    copies,
  };

  void productVariantsAPI
    .getBarcodeImage(variant.id)
    .then((src) => {
      executePrint(
        buildLabelsHtml({ ...labelData, barcodeImageSrc: src }),
        config,
        sheetClass,
        `Barcode Labels – ${variant.name}`,
      );
    })
    .catch(() => {
      executePrint(
        buildLabelsHtml({ ...labelData, barcodeImageSrc: "" }),
        config,
        sheetClass,
        `Barcode Labels – ${variant.name}`,
      );
    });
};
