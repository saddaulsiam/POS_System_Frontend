import React from "react";
import { TopProduct } from "../../types/analyticsTypes";
import { formatCurrency } from "../../utils/currencyUtils";

interface TopProductsTableProps {
  topProducts: TopProduct[];
  settings: any;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({
  topProducts,
  settings,
}) => (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-bold text-gray-800">Top Products</h2>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Rank
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Product
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Category
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">
              Qty Sold
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">
              Revenue
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">
              Avg Price
            </th>
          </tr>
        </thead>
        <tbody>
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-orange-600"
                            : "bg-blue-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">
                  {product.quantitySold.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {formatCurrency(product.revenue, settings)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(product.averagePrice, settings)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                No product data available for this period
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
