import db from "./client.js";
import bcrypt from "bcrypt";

console.log("Seeding database...")



async function seed() {
  try {

    //Clear existing data
    await db.query("DELETE FROM tasks;");
    await db.query("DELETE FROM users;");

    //Hash passwords
    const claudiaPassword = await bcrypt.hash("password123", 10);
    const valentinaPassword = await bcrypt.hash("password234", 10);

    //Insert users and get their IDs
    const { rows: users } = await db.query(`
    INSERT INTO users (username, password)
    VALUES 
    ('claudia', $1), 
    ('valentina', $2)
    RETURNING id
    `, [claudiaPassword, valentinaPassword]);

    const claudiaId = users[0].id;
    const valentinaId = users[1].id;

    //Insert tasks for Claudia
    await db.query(`
      INSERT INTO tasks (title, done, user_id)
      VALUES
      ('Finish workshop', false, $1),
      ('Work on website', false, $1),
      ('Order pups food', false, $1)
      `, [claudiaId]);

    //Insert tasks for Valentina
    await db.query(`
        INSERT INTO tasks (title, done, user_id)
        VALUES
        ('Read chapter book', false, $1), 
        ('Go ice skating', false, $1), 
        ('Play family games', false, $1)
        `, [valentinaId]);

    console.log("Database seeding complete!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await db.end();
  }
}
seed();
