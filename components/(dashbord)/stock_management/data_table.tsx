"use client";
import React, { useState, useMemo } from "react";
import { ArrowUpDown, Search, Building2 } from "lucide-react";
import { formatDateWithSuffix } from "@/lib/date";
interface IStockManagement {
  _id: string;
  partnerId: string;
  partnerName: string;
  lastModifiedAt: string;
  articleName: string;
  quantityInStock: number;
  weight: number;
  average: number;
  numberOfBags?: number;
}

function Data_table({ stocks}: { stocks: IStockManagement[], setStocks: React.Dispatch<React.SetStateAction<IStockManagement[]>> }) {
  // const [stocks, setStocks] = useState<IStockManagement[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IStockManagement;
    direction: "ascending" | "descending";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (key: keyof IStockManagement) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredStocks = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return stocks.filter(
      (stock) =>
        stock.partnerName.toLowerCase().includes(searchLower) ||
        stock.articleName.toLowerCase().includes(searchLower)
    );
  }, [stocks, searchTerm]);

  const sortedStocks = useMemo(() => {
    if (!sortConfig) return filteredStocks;

    return [...filteredStocks].sort((a, b) => {
      if (a[sortConfig.key]! < b[sortConfig.key]!) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key]! > b[sortConfig.key]!) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredStocks, sortConfig]);

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="w-5 h-5" /> Current Stock Inventory
        </h2>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by partner or article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: "Party Name", key: "partnerName" },
                { label: "Article", key: "articleName" },
                { label: "Qty in Stock", key: "quantityInStock" },
                { label: "Weight (kg)", key: "weight" },
                { label: "Avg (kg/unit)", key: "average" },
                { label: "Bags", key: "numberOfBags" },
                { label: "Last Updated", key: "lastModifiedAt" },
              ].map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer`}
                  onClick={() => handleSort(col.key as keyof IStockManagement)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStocks.length > 0 ? (
              sortedStocks.map((stock) => (
                <tr key={stock._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stock.partnerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {capitalize(stock.articleName)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.quantityInStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.weight?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.average?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.numberOfBags ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateWithSuffix(stock.lastModifiedAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No stock entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Data_table;
