import express from "express";

// Controller Import
import {
    loginstudent,
    searchstudent,
    getallstudent,
    updateStudentProfile,
    markInAttendance,
    markOutAttendence,
    absentStudent
} from "../controllers/StudentController.js";


const studentRoute = express.Router();

studentRoute.post('/login-student', loginstudent);
studentRoute.post('/search-student/:query', searchstudent);
studentRoute.get('/get-all-student', getallstudent);
studentRoute.post('/update-student-porfile/:id', updateStudentProfile);
studentRoute.post('/mark-in-attendece/:id', markInAttendance);
studentRoute.post('/mark-out-attendece/:id', markOutAttendence);
studentRoute.post('/absent/:id', absentStudent);

export default studentRoute;