import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import Clipboard from "@/models/Clipboard";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get ID from query parameter instead of body
    const { id } = req.query;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Clipboard ID is required",
      });
    }

    await dbConnect();

    // Find and delete clipboard
    const clipboard = await Clipboard.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!clipboard) {
      return res.status(404).json({
        success: false,
        message: "Clipboard not found",
      });
    }

    await clipboard.deleteOne();
    let io = res.socket.server.io;
    io.to(session.user.id).emit("delete_copy", {
      clipboardId: clipboard._id,
    });

    return res.status(200).json({
      success: true,
      message: "Clipboard deleted successfully",
    });
  } catch (error) {
    console.error("Clipboard deletion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
