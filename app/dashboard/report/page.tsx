"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  FileDown,
  ArrowUpDown,
  NotebookText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as XLSX from "xlsx";
import { formatDateWithSuffix } from "@/lib/date";

interface IDetailedAnalysis {
  _id: string;
  partnerId: string;
  partnerName: string;
  articleName: string;
  type: "buy" | "sell";
  quantity: number;
  weight: number;
  average: number;
  numberOfBags?: number;
  transactionDate: Date;
  notes?: string;
}

interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface IPartnerList{
  partnerName: string;
}

interface IArcileList{
  articleName:string;
}

export default function DetailedAnalysisReport() {
  const [data, setData] = useState<IDetailedAnalysis[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [articleSearch, setArticleSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "buy" | "sell">("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IDetailedAnalysis;
    direction: "ascending" | "descending";
  } | null>(null);
  const [PartnersList, setPartnersList] = useState<string[]>([]);
  const [ArticlesList, setArticlesList] = useState<string[]>([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        const [partnersRes, articlesRes] = await Promise.all([
          fetch("/api/partner?type=partner"),
          fetch("/api/partner?type=article"),
        ]);

        const partnersJson = await partnersRes.json();
        const articlesJson = await articlesRes.json();

        setPartnersList(partnersJson.partners.map((p: IPartnerList) => p.partnerName).sort());
        setArticlesList(articlesJson.articles.map((a: IArcileList) => a.articleName).sort());
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          partner: partnerSearch,
          article: articleSearch,
          type: typeFilter,
          page: pagination.page.toString(),
        }).toString();

        const res = await fetch(`/api/detailed-analysis?${query}`);
        const json = await res.json();

        const formattedData = json.data.map((item: IDetailedAnalysis) => ({
          ...item,
          transactionDate: new Date(item.transactionDate),
        }));

        setData(formattedData);
        setPagination(json.pagination);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [partnerSearch, articleSearch, typeFilter, pagination.page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof IDetailedAnalysis) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedData.map((item) => ({
        Party: item.partnerName,
        Article: item.articleName,
        Type: item.type === "buy" ? "Purchase" : "Sale",
        Quantity: item.quantity,
        "Weight (kg)": item.weight,
        Average: item.average,
        Bags: item.numberOfBags || "-",
        Date: item.transactionDate.toLocaleDateString(),
        Notes: item.notes || "-",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detailed Analysis");
    XLSX.writeFile(workbook, "Detailed_Analysis_Report.xlsx");
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <NotebookText className="w-6 h-6" /> Detailed Transaction Analysis
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* <input
            type="text"
            placeholder="Search Party Name..."
            value={partnerSearch}
            onChange={(e) => {
              setPartnerSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="p-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          /> */}
        <div className="relative">
          <select
            value={partnerSearch}
            onChange={(e) => {
              setPartnerSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="p-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full appearance-none"
          >
            <option value="">All Parties</option>
            {PartnersList.map((partnerName, index) => (
              <option key={index} value={partnerName}>
                {partnerName}
              </option>
            ))}
          </select>

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={articleSearch}
            onChange={(e) => {
              setArticleSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="p-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full appearance-none"
          >
            <option value="">All Articles</option>
            {ArticlesList.map((partnerName, index) => (
              <option key={index} value={partnerName}>
                {partnerName}
              </option>
            ))}
          </select>

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as "" | "buy" | "sell");
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors justify-center"
        >
          <FileDown className="w-5 h-5" /> Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: "Party Name", key: "partnerName" },
                { label: "Article", key: "articleName" },
                { label: "Type", key: "type" },
                { label: "Qty", key: "quantity" },
                { label: "Weight", key: "weight" },
                { label: "Avg", key: "average" },
                { label: "Bags", key: "numberOfBags" },
                { label: "Date", key: "transactionDate" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key as keyof IDetailedAnalysis)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr
                  key={item._id}
                  className={item.type === "buy" ? "bg-blue-50" : "bg-green-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.partnerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {capitalize(item.articleName)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === "buy"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.type === "buy" ? "Purchase" : "Sale"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.weight.toFixed(2)} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{item.average.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.numberOfBags || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateWithSuffix(item.transactionDate)}
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {item.notes || "-"}
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No transactions found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
              className={`p-2 rounded-md ${
                !pagination.hasPreviousPage
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className={`p-2 rounded-md ${
                !pagination.hasNextPage
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
