import express from "express";
import { createUser, userLogin } from "../db/queries/users.js";
import bcrypt from 'bcrypt';
import { verifyToken, newUserCheck } from "#middleware";
import jwt from "jsonwebtoken"

const router = express.Router();

router.get('/protected', verifyToken, (req, res) => {
    res.send(`Hello ${req.user.username}, this is a protected route.`)
});

router.post('/register', newUserCheck, async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required."});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const addUserIntoDb = await createUser({ username, hashedPassword });

        const token = jwt.sign({ id: addUserIntoDb.id, username: addUserIntoDb.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
        res.status(201).json({ token });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required."});
    }
    try {
        const user = await userLogin(req.body);

        //Generates JWT if login was successful
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
        res.status(200).json({ token });
    } catch (err) {
        console.error('Could not login:', err);
        res.status(401).json({ error: 'Invalid username or password' });
    }
})

export default router;


   