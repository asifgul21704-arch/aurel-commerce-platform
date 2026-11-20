import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin", "owner"], default: "customer" },
  isActive: { type: Boolean, default: true },
  cartItems: { type: [{ productId: { type: String, required: true, trim: true, maxlength: 120 }, quantity: { type: Number, required: true, min: 1, max: 20, validate: Number.isInteger }, size: { type: String, default: "", maxlength: 8 }, color: { type: String, default: "", maxlength: 40 } }], default: [] },
  savedProductIds: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
