import jwt from 'jsonwebtoken';
import db from "./db/client.js";

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
  
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).send("No token provided");
    }
    const token = authHeader.split(' ')[1];
  
    try {
      const decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedJWT;
      next();
    } catch (err) {
      return res.status(401).send("Invalid or expired token");
    }
  }

  export async function newUserCheck(req, res, next) {
    const { username } = req.body;
    try{
      const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      return res.status(409).json({ error: "This username already exists" });
    }
    next();
    } catch (err) {
      next(err);
    }
  }
    
  