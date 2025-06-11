import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import { StockManagement } from "@/models/StockManagement";
import { Partner } from "@/models/Partner";
import { DetailedAnalysis } from "@/models/DetailedAnalysis";

interface Stock {
  _id: string;
    partnerId: {
        _id: string;
        partnerName: string;
    };
    lastModifiedAt: Date;
    articleName: string;
    quantity: number;
    weight: number;
    average: number;
    numberOfBags?: number;
}

export async function GET() {
  try {
    await connectDB();

    const stocks = await StockManagement.find({})
      .populate("partnerId", "partnerName")
      .lean();

    const formattedStocks = stocks.map((stock) => {
      const s = stock as unknown as Stock;
      return {
        _id: s._id,
        partnerId: s.partnerId._id,
        partnerName: s.partnerId.partnerName,
        lastModifiedAt: s.lastModifiedAt,
        articleName: s.articleName,
        quantityInStock: s.quantity,
        weight: s.weight,
        average: s.average,
        numberOfBags: s.numberOfBags,
      };
    });

    return NextResponse.json(formattedStocks, { status: 200 });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      { message: "Error fetching stocks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      partnerName,
      articleName,
      quantityInStock,
      weight,
      average,
      numberOfBags,
      date
    } = await req.json();

    const normalizedPartnerName = partnerName.toLowerCase();

    let partner = await Partner.findOne({ partnerName: normalizedPartnerName });

    if (!partner) {
      partner = new Partner({
        partnerName: normalizedPartnerName,
        createdAt: new Date()
      });
      await partner.save();
    }

    const existingStock = await StockManagement.findOne({
      partnerId: partner._id,
      articleName: articleName
    });

    if (existingStock) {
      existingStock.quantity += quantityInStock;
      existingStock.weight += weight;
      existingStock.numberOfBags += numberOfBags;


    //   const totalUnitsBefore = existingStock.quantity - quantityInStock;
    //   const totalUnitsAfter = existingStock.quantity;

    //   const totalWeightBefore = existingStock.weight - weight;
    //   const totalWeightAfter = existingStock.weight;

      existingStock.average = existingStock.weight / existingStock.quantity;

      existingStock.lastModifiedAt = date;

      await existingStock.save();

      return NextResponse.json(
        { message: "Stock updated successfully", stock: existingStock },
        { status: 200 }
      );
    } else {
      const newStock = new StockManagement({
        partnerId: partner._id,
        articleName: articleName,
        quantity: quantityInStock,
        weight: weight,
        average: average,
        numberOfBags: numberOfBags,
        createdAt:date,
        lastModifiedAt: new Date(),
      });

      await newStock.save();

      const detailedAnalysis = new DetailedAnalysis({
        partnerId: partner._id,
        articleName: articleName,
        type: 'buy',
        quantity: quantityInStock,
        weight: weight,
        average: average,
        numberOfBags: numberOfBags,
        transactionDate: date,
      });

       await detailedAnalysis.save();

      return NextResponse.json(
        { message: "Stock added successfully", stock: newStock },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error(" Error adding/updating stock:", error);
    return NextResponse.json(
      { message: "Error adding/updating stock" },
      { status: 500 }
    );
  }
}

