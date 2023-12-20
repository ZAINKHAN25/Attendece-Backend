import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from 'cors';

// Routes Import
import studentRoute from './routes/Student.js';
import adminRoute from './routes/Admin.js';

// Const Area
const app = express();
const port = 8000;


dotenv.config();


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Succesfully connected to db");

        // Middle Ware Area
        app.use(express.json());
        app.use(cors())

        // Admin Portion
        app.use('/admin', adminRoute);
        // Student Portion
        app.use('/student', studentRoute);

    }).catch((error) => {
        console.error(error)
    })


// Listeninig Area
app.listen(port, () => {
    console.log(`Port is running on port number http:localhost:${port}/`);
})