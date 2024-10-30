import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import Clipboard from "@/models/Clipboard";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    try {
      let { page = 1, limit = 10 } = req.query;
      if (limit > 10) {
        limit = 10;
      }
      const skip = (+page - 1) * +limit;
      const total = await Clipboard.countDocuments({
        userId: session.user.id,
      });
      const clipboards = await Clipboard.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        clipboards,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
