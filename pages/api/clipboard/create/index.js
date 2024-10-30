import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import Clipboard from "@/models/Clipboard";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await dbConnect();

    // Destructure the request body
    const { content, isSecure: isEncrypted, securePin } = req.body;

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }
    // Prepare clipboard data
    const clipboardData = {
      userId: session.user.id,
      content,
      isEncrypted,
      securePin: securePin ? await bcrypt.hash(securePin, 10) : null,
    };

    // Create clipboard entry
    const clipboard = await Clipboard.create(clipboardData);
    let io = res.socket.server.io;
    io.to(session.user.id).emit("clipboard-update", clipboard);
    return res.status(201).json({
      success: true,
      data: clipboard,
    });
  } catch (error) {
    console.error("Clipboard creation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
