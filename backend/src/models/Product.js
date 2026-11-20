import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true, maxlength: 140 },
  collection: { type: String, required: true, trim: true, maxlength: 80 },
  category: { type: String, default: "General", trim: true, maxlength: 80 },
  description: { type: String, default: "", maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ["USD", "EUR"], required: true, default: "USD" },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
