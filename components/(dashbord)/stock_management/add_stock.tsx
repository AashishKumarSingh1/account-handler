"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Database, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface IStockManagement {
  _id: string;
  partnerName: string;
  lastModifiedAt: Date;
  articleName: string;
  quantityInStock: number;
  weight: number;
  average: number;
  numberOfBags?: number;
  date: string;
}

interface IPartner {
  _id: string;
  partnerName: string;
}

interface IArticle {
  articleName: string;
  totalQuantity: number;
}

function Add_stock({ onStockAdded }: { onStockAdded: () => void }) {
  const [newStock, setNewStock] = useState<Omit<IStockManagement, "_id" | "lastModifiedAt">>({
    partnerName: "",
    articleName: "",
    quantityInStock: 0,
    weight: 0,
    average: 0,
    numberOfBags: 0,
    date: new Date().toISOString().split("T")[0] as string,
  });

  const [partners, setPartners] = useState<IPartner[]>([]);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [showArticleDropdown, setShowArticleDropdown] = useState(false);
  const [filteredPartners, setFilteredPartners] = useState<IPartner[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<IArticle[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);
        const [partnersRes, articlesRes] = await Promise.all([
          axios.get("/api/partner?type=partner"),
          axios.get("/api/partner?type=article")
        ]);
        
        setPartners(partnersRes.data?.partners || []);
        setArticles(articlesRes.data?.articles || []);
        setFilteredPartners(partnersRes.data?.partners || []);
        setFilteredArticles(articlesRes.data?.articles || []);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Failed to load options");
        setPartners([]);
        setArticles([]);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStock((prev) => ({
      ...prev,
      [name]: name === "date" ? value : Number(value),
    }));
  };

  const handlePartnerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewStock(prev => ({ ...prev, partnerName: value }));
    
    if (value) {
      setFilteredPartners(
        partners.filter(partner =>
          partner.partnerName.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredPartners(partners);
    }
    setShowPartnerDropdown(true);
  };

  const handleArticleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewStock(prev => ({ ...prev, articleName: value }));
    
    if (value) {
      setFilteredArticles(
        articles.filter(article =>
          article.articleName.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredArticles(articles);
    }
    setShowArticleDropdown(true);
  };

  const selectPartner = (partnerName: string) => {
    setNewStock(prev => ({ ...prev, partnerName }));
    setShowPartnerDropdown(false);
  };

  const selectArticle = (articleName: string) => {
    setNewStock(prev => ({ ...prev, articleName }));
    setShowArticleDropdown(false);
  };

  const handleAddStock = async () => {
    if (
      !newStock.partnerName ||
      !newStock.articleName ||
      newStock.quantityInStock <= 0 ||
      newStock.weight <= 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const calculatedAverage = newStock.quantityInStock / newStock.weight ;

    try {
      setLoading(true);
      await axios.post("/api/stocks", {
        ...newStock,
        articleName: newStock.articleName.trim(),
        partnerName: newStock.partnerName.trim(),
        average: parseFloat(calculatedAverage.toFixed(2)),
      });

      toast.success("Stock added successfully!");
      setNewStock({
        partnerName: "",
        articleName: "",
        quantityInStock: 0,
        weight: 0,
        average: 0,
        numberOfBags: 0,
        date: new Date().toISOString().split("T")[0],
      });
      onStockAdded();
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error("Something went wrong while adding stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
        <Plus className="w-5 h-5 text-blue-600" /> Add New Stock Entry
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={newStock.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1 relative">
            <label className="block text-sm font-medium text-gray-700">
              Party Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="partnerName"
                value={newStock.partnerName}
                onChange={handlePartnerInput}
                onFocus={() => setShowPartnerDropdown(true)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-8"
                required
                placeholder="Type or select a partner"
              />
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {showPartnerDropdown && filteredPartners.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredPartners.map((partner) => (
                  <div
                    key={partner._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectPartner(partner.partnerName)}
                  >
                    {partner.partnerName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1 relative">
            <label className="block text-sm font-medium text-gray-700">
              Article <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="articleName"
                value={newStock.articleName}
                onChange={handleArticleInput}
                onFocus={() => setShowArticleDropdown(true)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-8"
                required
                placeholder="Type or select an article"
              />
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {showArticleDropdown && filteredArticles.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredArticles.map((article, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectArticle(article.articleName)}
                  >
                    {article.articleName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Quantity Produced <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              name="quantityInStock"
              value={newStock.quantityInStock || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              name="weight"
              value={newStock.weight || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Number of Bags (optional)
            </label>
            <input
              type="number"
              min="0"
              name="numberOfBags"
              value={newStock.numberOfBags || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Average Weight
            </label>
            <div className="p-2 bg-gray-50 border border-gray-300 rounded-md">
              {newStock.quantityInStock && newStock.weight
                ? (newStock.weight / newStock.quantityInStock).toFixed(2)
                : "0.00"}{" "}
              kg/unit
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleAddStock}
            disabled={loading || optionsLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="w-5 h-5" />
            {loading ? "Adding..." : "Add Stock Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Add_stock;