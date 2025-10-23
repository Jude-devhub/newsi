import jwt from "jsonwebtoken";

export function verifyAuth(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1];
  if (!token) throw new Error("No token found");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // contains { id, email, name }
  } catch {
    throw new Error("Invalid or expired token");
  }
}
