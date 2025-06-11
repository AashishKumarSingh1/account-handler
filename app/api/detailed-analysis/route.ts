import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { DetailedAnalysis } from "@/models/DetailedAnalysis";
export async function GET(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const partnerSearch = url.searchParams.get("partner") || "";
    const articleSearch = url.searchParams.get("article") || "";
    const typeFilter = url.searchParams.get("type") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 15;
    const skip = (page - 1) * limit;

    const matchStage: Record<string, unknown> = {};

    if (typeFilter === "buy" || typeFilter === "sell") {
      matchStage.type = typeFilter;
    }

    if (partnerSearch) {
      matchStage["partner.partnerName"] = { $regex: partnerSearch, $options: "i" };
    }

    if (articleSearch) {
      matchStage.articleName = { $regex: articleSearch, $options: "i" };
    }

    const commonPipeline: import("mongoose").PipelineStage[] = [
      {
        $lookup: {
          from: "partners",
          localField: "partnerId",
          foreignField: "_id",
          as: "partner",
        },
      },
      { $unwind: { path: "$partner" } },
      { $match: matchStage },
      {
        $project: {
          _id: 1,
          partnerId: 1,
          partnerName: "$partner.partnerName",
          articleName: 1,
          type: 1,
          quantity: 1,
          weight: 1,
          average: 1,
          numberOfBags: 1,
          transactionDate: 1,
          notes: 1,
        },
      },
      { $sort: { transactionDate: -1 } },
    ];

    const data = await DetailedAnalysis.aggregate([
      ...commonPipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    const countResult = await DetailedAnalysis.aggregate([
      ...commonPipeline,
      { $count: "total" },
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching detailed analysis:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
