
import express from "express";

// Controller Import
import {
    signupadmin,
    loginadmin,
    addCourse,
    updateCourse,
    addStudent,
    updateAdminProfile,
    deleteStudentProfile
} from '../controllers/AdminController.js'

const adminRoute = express.Router();

adminRoute.post('/sign-up-admin', signupadmin);
adminRoute.post('/login-admin', loginadmin);
adminRoute.post('/add-course', addCourse);
adminRoute.post('/update-course/:id', updateCourse);
adminRoute.post('/add-student', addStudent);
adminRoute.post('/update-admin-porfile/:id', updateAdminProfile);
adminRoute.delete('/delete-student-porfile/:id', deleteStudentProfile);

export default adminRoute;
