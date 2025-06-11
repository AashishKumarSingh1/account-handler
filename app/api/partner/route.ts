import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";
import { StockManagement } from "@/models/StockManagement";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "partner";

    if (type === "partner") {
      const partners = await Partner.find({}).lean();

      return NextResponse.json(
        {
          partners: partners.map((partner) => ({
            _id: partner._id,
            partnerName: partner.partnerName,
          })),
        },
        { status: 200 }
      );
    }

    if (type === "article") {
      const articles = await StockManagement.aggregate([
        {
          $group: {
            _id: "$articleName",
            totalQuantity: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            articleName: "$_id",
            totalQuantity: 1,
          },
        },
      ]);
      return NextResponse.json(
        {
          articles: articles.map((article) => ({
            articleName: article.articleName,
            totalQuantity: article.totalQuantity,
          })),
        },
        { status: 200 }
      );
      // const agencies = 
    }

    if (type === "partner_and_agency") {
      const stockWithPartner = await StockManagement.aggregate([
        {
          $lookup: {
            from: "partners",
            localField: "partnerId",
            foreignField: "_id",
            as: "partnerInfo",
          },
        },
        { $unwind: "$partnerInfo" },
        {
          $project: {
            _id: 1,
            partnerId: "$partnerInfo._id",
            partnerName: "$partnerInfo.partnerName",
            articleName: 1,
            quantity: 1,
          },
        },
      ]);

      return NextResponse.json(
        {
          partners: stockWithPartner.map((item) => ({
            _id: item.partnerId,
            partnerName: item.partnerName,
            articleName: item.articleName,
            quantity: item.quantity,
          })),
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { message: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { message: "Error fetching partners" },
      { status: 500 }
    );
  }
}
