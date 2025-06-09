import db from "../client.js";

// Gets all tasks for a user. ORDER BY id organizes the tasks in order of insertion. 
export async function getTasksByUser(userId) {
    const result = await db.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY id;", [userId]
            ); 
    return result.rows;
}
// Gets a single task by ID
export async function getTasksById(taskId) {
   const result =  await db.query(
    `SELECT * FROM tasks WHERE id = $1;`,
    [taskId]
   );
   return result.rows[0]; 
}

//Creates a new task for a user
export async function createTask(userId, title, done = false) {
    const result = await db.query(
        `INSERT INTO tasks (title, done, user_id)
       VALUES ($1, $2, $3)
       RETURNING *;`,
        [title, done, userId]
    );
    return result.rows[0];
}

//Updates a task for a user
export async function updateTask(taskId, title, done = false) {
    const result = await db.query(
        `UPDATE tasks SET title = $1, done = $2 WHERE id = $3
        RETURNING *;`, 
        [title, done, taskId]
    );
    return result.rows[0];
}

//Deletes a task for a user
export async function deleteTask(taskId, userId) {
    const result = await db.query(
        `DELETE FROM tasks where id = $1 AND user_id = $2
        RETURNING *;`, 
        [taskId, userId] 
    );
    return result.rows[0];
}
