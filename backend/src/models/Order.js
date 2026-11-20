import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  currency: String,
  size: String,
  color: String
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  address: { type: String, required: true, trim: true, maxlength: 240 },
  city: { type: String, required: true, trim: true, maxlength: 80 },
  postalCode: { type: String, default: "", trim: true, maxlength: 20 },
  country: { type: String, required: true, trim: true, maxlength: 80 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true, validate: value => value.length > 0 },
  shipping: { type: shippingSchema, required: true },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ["USD", "EUR"], required: true },
  payment: {
    method: { type: String, enum: ["demo-card", "demo-wallet"], default: "demo-card" },
    status: { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
    reference: String
  },
  status: { type: String, enum: ["pending", "processing", "completed", "cancelled"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
