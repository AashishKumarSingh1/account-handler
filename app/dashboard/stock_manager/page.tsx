"use client"
import React from 'react';
import { Package } from 'lucide-react';
import Data_table from '@/components/(dashbord)/stock_management/data_table';
import Add_stock from '@/components/(dashbord)/stock_management/add_stock';
import axios from 'axios';
import { useState, useEffect } from 'react';

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

export default function StockManagementPage() {
  const [stocks, setStocks] = useState<IStockManagement[]>([]);
  
  const fetchStocks = async () => {
    try {
      const response = await axios.get("/api/stocks");
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };
  useEffect(() => {
      fetchStocks();
    }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Package className="w-6 h-6" /> Stock Management System
      </h1>
      
      <Add_stock onStockAdded={fetchStocks} />

      <Data_table stocks={stocks} setStocks={setStocks} />
    </div>
  );
}