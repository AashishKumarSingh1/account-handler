"use client";
import React, { useState } from "react";
import {
  Plus,
  Minus,
  Calculator,
  Percent,
  // ListFilter,
  // ChevronLeft,
  // ChevronRight,
  // Save,
  IndianRupee,
} from "lucide-react";

// Dummy data
// const dummyItems = Array.from({ length: 45 }, (_, i) => ({
//   id: i + 1,
//   date: new Date(2023, i % 12, (i % 28) + 1).toISOString().split("T")[0],
//   itemName: `Item ${i + 1}`,
//   quantity: Math.floor(Math.random() * 100) + 1,
//   purchaseCost: Math.floor(Math.random() * 1000) + 100,
//   profitPercent: Math.floor(Math.random() * 50) + 10,
//   gstApplied: i % 3 === 0,
//   gstPercent: i % 3 === 0 ? (i % 2 === 0 ? 12 : 18) : 0,
//   sellingPrice: 0,
// })).map((item) => ({
//   ...item,
//   unitCost: item.purchaseCost / item.quantity,
//   sellingPrice: calculateSellingPrice(
//     item.purchaseCost,
//     item.profitPercent,
//     item.gstApplied,
//     item.gstPercent
//   ),
// }));

// function calculateSellingPrice(
//   cost: number,
//   profitPercent: number,
//   gstApplied: boolean,
//   gstPercent: number
// ) {
//   const profitAmount = cost * (profitPercent / 100);
//   const priceBeforeTax = cost + profitAmount;
//   return gstApplied ? priceBeforeTax * (1 + gstPercent / 100) : priceBeforeTax;
// }

export default function ProfitCalculator() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState([
    {
      id: 1,
      itemName: "",
      quantity: 1,
      purchaseCost: 0,
      profitPercent: 20,
      gstApplied: false,
      gstPercent: 18,
    },
  ]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [applyOverallGST, setApplyOverallGST] = useState(false);
  const [overallGSTPercent, setOverallGSTPercent] = useState(18);
  // const itemsPerPage = 15;

  const calculateItem = (item: (typeof items)[0]) => {
    const unitCost = item.purchaseCost / (item.quantity || 1);
    const profitAmount = item.purchaseCost * (item.profitPercent / 100);
    const priceBeforeTax = item.purchaseCost + profitAmount;
    let sellingPrice = item.gstApplied
      ? priceBeforeTax * (1 + item.gstPercent / 100)
      : priceBeforeTax;

    if (applyOverallGST && !item.gstApplied) {
      sellingPrice = priceBeforeTax * (1 + overallGSTPercent / 100);
    }

    return { unitCost, sellingPrice };
  };

  const totals = items.reduce(
    (acc, item) => {
      const { sellingPrice } = calculateItem(item);
      const priceWithOverallGST = applyOverallGST
        ? sellingPrice * (1 + overallGSTPercent / 100)
        : sellingPrice;
      return {
        totalCost: acc.totalCost + item.purchaseCost,
        totalSelling:
          acc.totalSelling +
          (applyOverallGST ? priceWithOverallGST : sellingPrice),
        totalProfit: acc.totalProfit + (sellingPrice - item.purchaseCost),
        totalGST: applyOverallGST
          ? acc.totalGST + sellingPrice * (overallGSTPercent / 100)
          : acc.totalGST +
            (item.gstApplied
              ? sellingPrice -
                item.purchaseCost * (1 + item.profitPercent / 100)
              : 0),
      };
    },
    { totalCost: 0, totalSelling: 0, totalProfit: 0, totalGST: 0 }
  );

  // Calculate pagination
  // const totalPages = Math.ceil(dummyItems.length / itemsPerPage);
  // const currentItems = dummyItems.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  const handleAddItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    setItems([
      {
        id: newId,
        itemName: "",
        quantity: 1,
        purchaseCost: 0,
        profitPercent: 20,
        gstApplied: false,
        gstPercent: 18,
      },
      ...items,
    ]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleInputChange = (
    id: number,
    field: string,
    value: string | number | boolean
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // const handleSubmit = () => {
  //   alert("Items submitted successfully!");
  //   console.log("Submitted items:", items);
  // };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calculator className="w-6 h-6" /> Profit Calculator
      </h1>

      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors h-fit"
          >
            <Plus className="w-5 h-5" /> Add Item
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="overall-gst"
              checked={applyOverallGST}
              onChange={(e) => setApplyOverallGST(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="overall-gst"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Apply GST to all items
            </label>
          </div>

          {applyOverallGST && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">GST %</label>
              <input
                type="number"
                min="0"
                max="28"
                value={overallGSTPercent}
                onChange={(e) =>
                  setOverallGSTPercent(Number(e.target.value) || 0)
                }
                className="w-20 p-2 border rounded-md"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <IndianRupee className="w-4 h-4" /> Total Cost
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              ₹{totals.totalCost.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Percent className="w-4 h-4" /> Total Profit
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              ₹{totals.totalProfit.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <IndianRupee className="w-4 h-4" /> Total GST
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              ₹{totals.totalGST.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <IndianRupee className="w-4 h-4" /> Selling Price
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">
              ₹{totals.totalSelling.toFixed(2)}
            </p>
          </div>
        </div>

        {items.map((item) => (
          <div key={item.id} className="mb-6 p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Item #{item.id}</h3>
              {items.length > 1 && (
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={item.itemName}
                  onChange={(e) =>
                    handleInputChange(item.id, "itemName", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleInputChange(
                      item.id,
                      "quantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.purchaseCost}
                  onChange={(e) =>
                    handleInputChange(
                      item.id,
                      "purchaseCost",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost
                </label>
                <div className="p-2 bg-gray-100 rounded-md">
                  ₹{(item.purchaseCost / (item.quantity || 1)).toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Percent className="w-4 h-4" /> Profit %
                </label>
                <input
                  type="number"
                  min="0"
                  value={item.profitPercent}
                  onChange={(e) =>
                    handleInputChange(
                      item.id,
                      "profitPercent",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price
                </label>
                <div className="p-2 bg-gray-100 rounded-md font-medium">
                  ₹{calculateItem(item).sellingPrice.toFixed(2)}
                  {applyOverallGST && !item.gstApplied && (
                    <span className="text-xs text-gray-500 ml-2">
                      (+{overallGSTPercent}% GST)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!applyOverallGST && (
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`gst-${item.id}`}
                    checked={item.gstApplied}
                    onChange={(e) =>
                      handleInputChange(item.id, "gstApplied", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`gst-${item.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    Apply GST
                  </label>
                </div>

                {item.gstApplied && (
                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="28"
                      value={item.gstPercent}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "gstPercent",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mt-4 w-full justify-center"
        >
          <Save className="w-5 h-5" /> Submit All Items
        </button> */}
      </div>

      {/* <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ListFilter className="w-5 h-5" /> Previous Calculations
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.purchaseCost.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unitCost.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.profitPercent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.gstApplied ? `${item.gstPercent}%` : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.sellingPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, dummyItems.length)} of {dummyItems.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
