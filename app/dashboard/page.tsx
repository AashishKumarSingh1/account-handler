"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Scale,
  Database,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";

interface Partner {
  _id: string;
  partnerName: string;
}

interface Stock {
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

interface Article {
  articleName: string;
  totalQuantity: number;
}

interface Dispatch {
  _id: string;
  partnerId: string;
  partnerName: string;
  articleName: string;
  quantity: number;
  kg: number;
  average: number;
  numberOfBags?: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  _id: string;
  partnerId: string;
  partnerName: string;
  articleName: string;
  type: "buy" | "sell";
  quantity: number;
  weight: number;
  average: number;
  numberOfBags?: number;
  transactionDate: string;
  notes?: string;
}

interface DashboardData {
  partners: Partner[];
  stocks: Stock[];
  articles: Article[];
  dispatches: Dispatch[];
  transactions: Transaction[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          partnersRes,
          stocksRes,
          articlesRes,
          dispatchesRes,
          transactionsRes,
        ] = await Promise.all([
          axios.get("/api/partner?type=partner"),
          axios.get("/api/stocks"),
          axios.get("/api/partner?type=article"),
          axios.get("/api/dispatch"),
          axios.get("/api/detailed-analysis?limit=100"),
        ]);

        setData({
          partners: partnersRes.data?.partners || [],
          stocks: stocksRes.data || [],
          articles: articlesRes.data?.articles || [],
          dispatches: dispatchesRes.data?.data || [],
          transactions: transactionsRes.data?.data || [],
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const monthlyTransactions = data.transactions.reduce(
    (acc: Record<string, { name: string; buy: number; sell: number }>, transaction) => {
      const date = new Date(transaction.transactionDate);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      const type = transaction.type;

      if (!acc[key]) {
        acc[key] = {
          name: new Date(year, month, 1).toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          buy: 0,
          sell: 0,
        };
      }

      acc[key][type] += transaction.quantity;
      return acc;
    },
    {} as Record<string, { name: string; buy: number; sell: number }>
  );

  const monthlyTransactionsData = Object.values(monthlyTransactions).slice(
    0,
    6
  );

  const partnerDistribution = data.partners
    .map((partner) => {
      const partnerTransactions = data.transactions.filter(
        (t) => t.partnerId === partner._id
      );
      const totalQuantity = partnerTransactions.reduce(
        (sum, t) => sum + t.quantity,
        0
      );
      return {
        name: partner.partnerName,
        value: totalQuantity,
      };
    })
    .filter((item) => item.value > 0);


  const totalPartners = data.partners.length;
  const totalStockItems = data.stocks.length;
  const totalTransactions = data.transactions.length;

  const buyTransactions = data.transactions.filter(
    (t) => t.type === "buy"
  ).length;
  const sellTransactions = data.transactions.filter(
    (t) => t.type === "sell"
  ).length;

  const totalQuantity = data.stocks.reduce(
    (sum, item) => sum + item.quantityInStock,
    0
  );
  const totalWeight = data.stocks.reduce((sum, item) => sum + item.weight, 0);
  const totalDispatches = data.dispatches.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Inventory Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Users className="w-4 h-4" /> Partners
              </h3>
              <p className="text-2xl font-bold mt-2">{totalPartners}</p>
            </div>
            {/* <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {data.partners.length > 0
                ? `${Math.round(
                    (data.partners.length / (data.partners.length + 5)) * 100
                  )}%`
                : "0%"}
            </span> */}
          </div>
        </div>

        {/* Stock Items Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Package className="w-4 h-4" /> Stock Items
              </h3>
              <p className="text-2xl font-bold mt-2">{totalStockItems}</p>
            </div>
            {/* <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              {totalQuantity > 0
                ? `${Math.round(
                    (totalQuantity / (totalQuantity + 100)) * 100
                  )}%`
                : "0%"}
            </span> */}
          </div>
        </div>

        {/* Transactions Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Database className="w-4 h-4" /> Transactions
              </h3>
              <p className="text-2xl font-bold mt-2">{totalTransactions}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-green-600 text-xs flex items-center">
                <ArrowUpRight className="w-3 h-3" /> {buyTransactions} Buy
              </span>
              <span className="text-red-600 text-xs flex items-center">
                <ArrowDownRight className="w-3 h-3" /> {sellTransactions} Sell
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Scale className="w-4 h-4" /> Inventory Summary
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Quantity</p>
                <p className="font-bold">{totalQuantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Weight</p>
                <p className="font-bold">{totalWeight} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Dispatches</p>
                <p className="font-bold">{totalDispatches}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Weight/Unit</p>
                <p className="font-bold">
                  {totalQuantity > 0
                    ? (totalWeight / totalQuantity).toFixed(2)
                    : 0}{" "}
                  kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Monthly Transactions
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center text-xs">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>{" "}
                Buy
              </span>
              <span className="flex items-center text-xs">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>{" "}
                Sell
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTransactionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="buy" fill="#3b82f6" name="Purchases" />
                <Bar dataKey="sell" fill="#10b981" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" /> Partner Distribution
            </h3>
            <div className="flex gap-2">
              <span className="text-xs text-gray-500">By Quantity</span>
              <select className="text-xs border rounded px-2 py-1">
                <option>Transactions</option>
                <option>Stock</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={partnerDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {partnerDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} units`, "Quantity"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" /> Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.partnerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.articleName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "buy"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {transaction.type === "buy" ? "Purchase" : "Sale"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.weight} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Current Stock */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" /> Current Stock Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.stocks.slice(0, 5).map((stock) => (
                <tr key={stock._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stock.partnerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stock.articleName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.quantityInStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.weight} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{stock.average}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.numberOfBags || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(stock.lastModifiedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
