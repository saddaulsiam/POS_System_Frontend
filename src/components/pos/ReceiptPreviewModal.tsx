import React, { useEffect, useRef } from "react";

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  htmlContent: string;
  thermalContent?: string; // if provided, this is what gets printed
  onClose: () => void;
}

export const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  isOpen,
  htmlContent,
  thermalContent,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Write the correct content into iframe
  useEffect(() => {
    if (!isOpen || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    if (thermalContent) {
      // Thermal mode: render as monospace pre inside iframe
      doc.write(
        `<!DOCTYPE html><html><body style="margin:0;padding:12px;background:#fff">` +
        `<pre style="font-size:13px;font-family:monospace;white-space:pre-wrap;line-height:1.4;">${thermalContent}</pre>` +
        `</body></html>`
      );
    } else {
      // HTML receipt mode
      doc.write(htmlContent);
    }
    doc.close();
  }, [isOpen, htmlContent, thermalContent]);

  // Auto-print as soon as modal opens (mirrors SaleDetailsModal behaviour)
  useEffect(() => {
    if (!isOpen) return;
    // Small delay to let the iframe finish rendering before print dialog
    const timer = setTimeout(() => {
      handlePrint();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handlePrint = () => {
    const isElectron = (window as any).electron?.isElectron;

    if (thermalContent) {
      // Thermal print
      if (isElectron) {
        const thermalHTML =
          `<html><body style="margin:0;padding:0;">` +
          `<pre style="font-size:14px;font-family:monospace;margin:0;">${thermalContent}</pre>` +
          `</body></html>`;
        (window as any).electronAPI.send("print-silent", {
          htmlContent: thermalHTML,
          printerName: "",
        });
      } else {
        iframeRef.current?.contentWindow?.focus();
        iframeRef.current?.contentWindow?.print();
      }
    } else {
      // HTML receipt print
      if (isElectron) {
        (window as any).electronAPI.send("print-silent", {
          htmlContent,
          printerName: "",
        });
      } else {
        iframeRef.current?.contentWindow?.focus();
        iframeRef.current?.contentWindow?.print();
      }
    }
  };

  if (!isOpen || !htmlContent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Sale Complete!</h2>
              <p className="text-sm text-gray-500">
                {thermalContent ? "Thermal receipt" : "Receipt preview"} — printing...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Receipt iframe */}
        <div className="flex-1 overflow-hidden bg-gray-50 p-4">
          <iframe
            ref={iframeRef}
            title="Receipt Preview"
            className="h-full w-full rounded-lg border border-gray-200 bg-white"
            style={{ minHeight: 0 }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012 2v5a2 2 0 01-2 2h-2m-8 0h8v4H6v-4z"
              />
            </svg>
            {thermalContent ? "Print Thermal" : "Print Receipt"}
          </button>
        </div>
      </div>
    </div>
  );
};
