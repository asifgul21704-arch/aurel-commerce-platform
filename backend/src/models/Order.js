import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ productId: String, name: String, price: Number, quantity: Number }],
  total: { type: Number, required: true, min: 0 },
  payment: {
    method: { type: String, enum: ["demo-card", "demo-wallet"], default: "demo-card" },
    status: { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
    reference: String
  },
  status: { type: String, enum: ["pending", "processing", "completed", "cancelled"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
