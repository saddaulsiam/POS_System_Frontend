import React, { useState, useEffect, useRef } from "react";
import { Button } from "../common";
import { Product } from "../../types";
import { useProducts } from "../../services/queries";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface POSBarcodeScannerProps {
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onProductSelect?: (product: Product) => void;
}

export const POSBarcodeScanner: React.FC<POSBarcodeScannerProps> = ({
  barcode,
  onBarcodeChange,
  onSubmit,
  onProductSelect,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { settings } = useSettings();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch product suggestions using React Query
  const { data: productsData } = useProducts({
    search: barcode.trim().length >= 2 ? barcode : undefined,
    isActive: true,
    limit: 5,
  });

  const suggestions = productsData?.data || [];

  // Show/hide suggestions based on data
  useEffect(() => {
    if (barcode.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [barcode, suggestions.length]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev,
          );
          return;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          return;
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            e.preventDefault();
            handleSelectSuggestion(suggestions[selectedIndex]);
            return;
          }
          // If no suggestion is selected, allow form submit
          break;
        case "Escape":
          setShowSuggestions(false);
          return;
      }
    }
    // If Enter is pressed and no suggestion is selected, allow form submit
    if (
      e.key === "Enter" &&
      (selectedIndex === -1 || !showSuggestions || suggestions.length === 0)
    ) {
      // Let the form's onSubmit handle it
      return;
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product);
      onBarcodeChange("");
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBarcodeChange(e.target.value);
  };

  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            name="barcode"
            value={barcode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Scan barcode or search product..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              {suggestions.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectSuggestion(product)}
                  className={`cursor-pointer border-b border-gray-100 px-3 py-3 transition-colors last:border-b-0 hover:bg-blue-50 ${
                    index === selectedIndex ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Product Image */}
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-size='40' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E📦%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl text-gray-400">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {product.name}
                      </p>
                      <div className="mt-1 flex items-center space-x-3">
                        <span className="text-xs text-gray-500">
                          SKU: {product.sku}
                        </span>
                        {product.barcode && (
                          <span className="text-xs text-gray-500">
                            Barcode: {product.barcode}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            product.stockQuantity > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="ml-2 flex-shrink-0 text-right">
                      <p className="text-base font-bold text-green-600">
                        {formatCurrency(product.sellingPrice, settings)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </div>
  );
};
