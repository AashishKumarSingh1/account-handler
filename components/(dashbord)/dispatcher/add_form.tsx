"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
interface IPartnerStock {
  _id: string;
  partnerName: string;
  articleName: string;
  quantity: number;
}

interface AddFormProps {
  partners: IPartnerStock[];
  onDispatchCreated: () => void;
}

function Add_form({ partners, onDispatchCreated }: AddFormProps) {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [selectedArticleName, setSelectedArticleName] = useState<string>("");

  const { register, handleSubmit, reset, watch, setValue } = useForm<{
    partnerId: string;
    articleName: string;
    quantity: number;
    kg: number;
    average: number;
    numberOfBags?: number;
    date: Date;
  }>();

  const todayDate = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const quantity = watch("quantity");
  const kg = watch("kg");
  const computedAverage = kg && quantity ? quantity / kg : 0;

  const onSubmit = async (data: {
    partnerId: string;
    articleName: string;
    quantity: number;
    kg: number;
    average: number;
    numberOfBags?: number;
    createdAt?:Date;
  }) => {
    try {
      const res = await axios.post("/api/dispatch", {
        ...data,
      });

      console.log("Dispatch created:", res.data);

      reset();
      setSelectedArticleName("");
      toast.success("Dispatch created successfully!");
      onDispatchCreated();
    } catch (err) {
      console.error("Error submitting dispatch:", err);
      toast.error("Error submitting dispatch");
    }
  };

  const availableArticles = useMemo(() => {
    if (!selectedPartnerId) return [];
    return partners
      .filter((p) => p._id === selectedPartnerId)
      ?.map((p) => p.articleName);
  }, [selectedPartnerId, partners]);

  const currentStockQuantity = useMemo(() => {
    if (!selectedPartnerId) return 0;

    const filteredStocks = partners.filter((p) => p._id === selectedPartnerId);

    if (!selectedArticleName || selectedArticleName === "all") {
      return filteredStocks.reduce((acc, item) => acc + item.quantity, 0);
    } else {
      const articleStock = filteredStocks.find(
        (item) => item.articleName === selectedArticleName
      );
      return articleStock ? articleStock.quantity : 0;
    }
  }, [selectedPartnerId, selectedArticleName, partners]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Create New Dispatch</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                {...register("date", { required: true })}
                defaultValue={todayDate}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner
              </label>
              <select
                {...register("partnerId", { required: true })}
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  const partnerId = e.target.value;
                  setSelectedPartnerId(partnerId);
                  setValue("partnerId", partnerId);
                  setSelectedArticleName("");
                  setValue("articleName", "");
                }}
              >
                <option value="">Select Partner/Agency</option>
                {Array.from(
                  new Map(
                    partners?.map((p) => [p._id, p.partnerName])
                  ).entries()
                )?.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Article Name
              </label>
              <select
                {...register("articleName")}
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  const articleName = e.target.value;
                  setSelectedArticleName(articleName);
                  setValue("articleName", articleName);
                }}
                disabled={!selectedPartnerId}
              >
                <option value="all">All Articles (Total Stock)</option>
                {availableArticles?.map((article, idx) => (
                  <option key={idx} value={article}>
                    {article}
                  </option>
                ))}
              </select>
            </div>
          </div>
        {/* </div> */}

        {selectedPartnerId && (
          <div className="p-3 bg-gray-100 border rounded-md text-sm text-gray-700">
            Current Stock Quantity:{" "}
            <span className="font-semibold">{currentStockQuantity}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              {...register("quantity", { required: true, min: 1 })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("kg", { required: true, min: 0.01 })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average(quantity/weight)
            </label>
            <input
              type="number"
              value={computedAverage}
              readOnly
              step="0.01"
              {...register("average", { required: true })}
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Bags (optional)
          </label>
          <input
            type="number"
            {...register("numberOfBags")}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="inline mr-2" size={16} />
            Add Dispatch
          </button>
        </div>
      </form>
    </div>
  );
}

export default Add_form;
