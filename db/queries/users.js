import db from "../client.js";
import bcrypt from "bcrypt";

// Gets all users
export async function getAllUsers() {
    const result = await db.query("SELECT * FROM users;");
    return result.rows;
}

export async function createUser(data) {
    const { username, hashedPassword } = data;
    const result = await db.query(
        `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING *;`,
        [username, hashedPassword]
    );
    return result.rows[0];
}

export async function userLogin(data) {
    const {username, password} = data;
    const result = await db.query(
        `SELECT * FROM users WHERE username = $1;`, [username]
    );
    const user = result.rows[0];
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  return user;
}

