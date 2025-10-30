import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" })
}

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch {
    return null
  }
}

export const hashPassword = async (password) => {
  return bcryptjs.hash(password, 10)
}

export const comparePassword = async (password, hash) => {
  return bcryptjs.compare(password, hash)
}
