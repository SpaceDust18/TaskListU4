import express from "express";
import { getTasksByUser, createTask, updateTask, deleteTask, getTasksById } from "../db/queries/tasks.js";
import { verifyToken } from "#middleware";

const router = express.Router();

// GET /api/tasks
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const tasks = await getTasksByUser(userId);
        res.json(tasks);
    } catch (error) {
        next(error);
    }
});

// POST /api/tasks
router.post("/", verifyToken, async (req, res, next) => {
    try {
        const { title, done } = req.body;
        const userId = req.user.id;

        // Validates title
        if (!title || typeof title !== "string") {
            return res.status(400).json({ error: "Title is required and must be a string." });
        }
        // 'done' validation, if provided
        if (done !== undefined && typeof done !== "boolean") {
            return res.status(400).json({ error: "'done' must be a boolean." });
        }
        // Create the task
        const newTask = await createTask(userId, title, done);
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }

});
// PUT /api/tasks/:id
router.put("/:id", verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, done } = req.body;
        const userId = req.user.id;

        // Validates title
        if (!title || typeof title !== "string") {
            return res.status(400).json({ error: "Title is required and must be a string." });
        }
        // 'done' validation, if provided
        if (done !== undefined && typeof done !== "boolean") {
            return res.status(400).json({ error: "'done' must be a boolean." });
        }
        const task = await getTasksById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found." });
        }
        if (task.user_id !== userId) {
            return res.status(403).json({ error: "Forbidden: You do not own this task." })
        }
        const updatedTask = await updateTask(id, title, done);
        res.json(updatedTask);
    } catch (error) {
        next(error);
    }        
});

// DELETE /api/tasks/:id
router.delete("/:id", verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const task = await getTasksById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found." });
        }
        if (task.user_id !== userId) {
            return res.status(403).json({ error: "Forbidden: You do not own this task." });
        }
        const deleted = await deleteTask(id, userId);
    res.json({ message: "Task deleted", task: deleted });        
    } catch (error) {
        next(error);
    }
});

export default router;
