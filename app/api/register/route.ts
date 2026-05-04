import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "reader",
    });

    return NextResponse.json(
      { message: "Account created", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}