import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Clipboard from "@/models/Clipboard";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get data from request body
    const { id, pin } = req.body;

    // Validate required fields
    if (!id || !pin) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Connect to database
    await dbConnect();

    // Find clipboard entry
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

    // Verify PIN
    const isPinValid = await bcrypt.compare(pin, clipboard.securePin);
    if (!isPinValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid PIN",
      });
    }

    // If everything is valid, decrypt and return the content
    return res.status(200).json({
      success: true,
      content: clipboard.content, // Make sure this is the field name in your model
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Configure API route to parse body
export const config = {
  api: {
    bodyParser: true, // Enable body parsing
  },
};
