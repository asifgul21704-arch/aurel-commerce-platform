import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { connectDB } from "../config/db.js";

try {
  const { OWNER_NAME, OWNER_EMAIL, OWNER_PASSWORD } = process.env;
  if (!OWNER_NAME || !OWNER_EMAIL || !OWNER_PASSWORD || OWNER_PASSWORD.length < 14) {
    throw new Error("Set OWNER_NAME, OWNER_EMAIL and a private OWNER_PASSWORD of at least 14 characters in your local environment.");
  }
  await connectDB();
  const ownerExists = await User.exists({ role: "owner" });
  if (ownerExists) throw new Error("An owner already exists. This script will not create another owner.");
  const email = OWNER_EMAIL.trim().toLowerCase();
  if (await User.exists({ email })) throw new Error("That email is already registered.");
  const passwordHash = await bcrypt.hash(OWNER_PASSWORD, 12);
  await User.create({ name: OWNER_NAME.trim(), email, passwordHash, role: "owner" });
  console.log("Initial AUREL owner account created.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
