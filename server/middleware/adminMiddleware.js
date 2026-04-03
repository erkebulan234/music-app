import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Нет токена" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Нет доступа" });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Неверный токен" });
  }
};