import mongoose from "mongoose";

const clipboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    securePin: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

const ClipboardItem =
  mongoose.models.ClipboardItem ||
  mongoose.model("ClipboardItem", clipboardSchema);
export default ClipboardItem;
