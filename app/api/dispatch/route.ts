import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Dispatch } from "@/models/Dispatch";
import { DetailedAnalysis } from "@/models/DetailedAnalysis";
import { StockManagement } from "@/models/StockManagement";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();

    const { partnerId, articleName, quantity, kg, numberOfBags,date } = body;

    const average = kg && quantity ? quantity / kg : 0;

    const newDispatch = await Dispatch.create({
      partnerId,
      articleName,
      quantity,
      kg,
      average,
      numberOfBags,
      createdAt:date,
    });

    await DetailedAnalysis.create({
      partnerId,
      articleName,
      type: "sell",
      quantity,
      weight: kg,
      average,
      numberOfBags,
      transactionDate: date,
    });

    const existingStock = await StockManagement.findOne({
      partnerId:partnerId,
      articleName:articleName
    });

    if(existingStock){
      existingStock.quantity -= quantity;
      existingStock.weight -= kg;
      existingStock.numberOfBags -= numberOfBags;
      existingStock.average = existingStock.weight / existingStock.quantity;

      existingStock.lastModifiedAt = new Date();

      await existingStock.save();
    }

    // const detailedAnalysis = new DetailedAnalysis({
    //   partnerId:partnerId,
    //   articleName:articleName,
    //   type:'sell',
    //   quantity:quantity,
    //   weight:kg,
    //   average:average,
    //   numberOfBags:numberOfBags,
    //   transactionDate:new Date(),
    // });

    // await detailedAnalysis.save();

    return NextResponse.json(
      { message: "Dispatch created successfully", data: newDispatch },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating dispatch:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const dispatches = await Dispatch.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          partnerId: { $toObjectId: "$partnerId" },
        },
      },
      {
        $lookup: {
          from: "partners",
          localField: "partnerId",
          foreignField: "_id",
          as: "partnerDetails",
        },
      },
      {
        $unwind: {
          path: "$partnerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          partnerId: 1,
          articleName: 1,
          quantity: 1,
          kg: 1,
          average: 1,
          numberOfBags: 1,
          updatedAt: 1,
          createdAt:1,
          partnerName: "$partnerDetails.partnerName",
        },
      },
    ]);

    return NextResponse.json(
      { message: "Dispatches fetched successfully", data: dispatches },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dispatches:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
