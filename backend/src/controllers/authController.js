import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });

function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
}

export async function signup(req, res) {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (name.length < 2 || name.length > 80) return res.status(400).json({ message: "Enter a name between 2 and 80 characters." });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
  if (password.length < 10 || password.length > 128) return res.status(400).json({ message: "Password must be 10–128 characters." });
  if (await User.exists({ email })) return res.status(409).json({ message: "An account with this email already exists." });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: "customer" });
  res.status(201).json({ token: issueToken(user), user: publicUser(user) });
}

export async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Email or password is incorrect." });
  }
  res.json({ token: issueToken(user), user: publicUser(user) });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

export async function createAdmin(req, res) {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12) {
    return res.status(400).json({ message: "Provide a valid name, email and password of at least 12 characters." });
  }
  if (await User.exists({ email })) return res.status(409).json({ message: "That email is already registered." });
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.create({ name, email, passwordHash, role: "admin", createdBy: req.user._id });
  res.status(201).json({ user: publicUser(admin) });
}

export async function listAdmins(_req, res) {
  const admins = await User.find({ role: "admin" }).select("name email isActive createdAt").sort({ createdAt: -1 });
  res.json({ admins });
}

export async function setAdminStatus(req, res) {
  const admin = await User.findOne({ _id: req.params.id, role: "admin" });
  if (!admin) return res.status(404).json({ message: "Administrator not found." });
  admin.isActive = Boolean(req.body.isActive);
  await admin.save();
  res.json({ user: publicUser(admin), isActive: admin.isActive });
}
