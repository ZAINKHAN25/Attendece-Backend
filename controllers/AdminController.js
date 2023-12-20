import bcrypt from 'bcrypt';

import Admin from '../models/Admin.js';
import Course from '../models/Course.js';
import Students from '../models/Students.js';


function signupadmin(req, res) {
    const { adminFirstName, adminLastName, adminCnic, img, email, password } = req.body;

    if (!adminFirstName || !adminCnic || !email || !password) {
        return res.status(400).json({
            message: "Please fill up all required fields"
        });
    }

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        const admin = new Admin({
            adminFirstName,
            adminLastName,
            adminCnic,
            img,
            email,
            password: hash,
        });

        admin.save()
            .then(() => {
                res.status(201).json({ message: "Admin account created successfully" });
            })
            .catch((error) => {
                res.status(500).json({ message: "Internal Server Error", error: error.message });
            });
    });
}

function loginadmin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide both email and password"
        });
    }

    // Find the admin by email
    Admin.findOne({ email })
        .then(admin => {
            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            // Compare the provided password with the hashed password stored in the database
            bcrypt.compare(password, admin.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Internal Server Error",
                        error: err.message
                    });
                }

                if (result) {
                    return res.status(200).json({
                        message: "Login successful",
                        admin: {
                            adminFirstName: admin.adminFirstName,
                            adminLastName: admin.adminLastName,
                            adminCnic: admin.adminCnic,
                            img: admin.img,
                            email: admin.email,
                            // Include any other admin data you want to send in the response
                        }
                    });
                } else {
                    // Passwords do not match
                    return res.status(401).json({
                        message: "Invalid password"
                    });
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        });
}

function addCourse(req, res) {
    const { courseName, courseBatch, courseTeacher, courseDays, courseTiming, courseShortName } = req.body;

    if (!courseName || !courseBatch || !courseTeacher || !courseDays || !courseTiming || !courseShortName) {
        return res.status(400).json({
            message: "Please fill up all required fields"
        });
    }

    const newCourse = new Course({
        courseName,
        courseBatch,
        courseTeacher,
        courseDays,
        courseTiming,
        students: [],
        attendence: [],
        courseShortName
    });

    newCourse.save()
        .then(() => {
            res.status(201).json({ message: "Course added successfully" });
        })
        .catch((error) => {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        });
}

function updateCourse(req, res) {
    const courseId = req.params.id;
    console.log(req.params, "Course id");
    const { courseName, courseBatch, courseTeacher, courseDays, courseTiming, courseShortName } = req.body;

    // Check if all required fields are present
    if (!courseId || !courseName || !courseBatch || !courseTeacher || !courseDays || !courseTiming || !courseShortName) {
        return res.status(400).json({
            message: "Please provide the course ID and fill up all required fields"
        });
    }

    // Use mongoose's `findByIdAndUpdate` to update the course
    Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                courseName,
                courseBatch,
                courseTeacher,
                courseDays,
                courseTiming,
                courseShortName
            }
        },
        { new: true } // Return the updated document
    )
        .then(updatedCourse => {
            if (!updatedCourse) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }
            res.status(200).json({
                message: "Course updated successfully",
                course: updatedCourse
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        });
}

async function addStudent(req, res) {
    const { studentFirstName, studentLastName, studentCourse, img, email, password, studentAttendance, batchNumber, studentShortCourseName, courseId } = req.body;

    if (!studentFirstName || !studentCourse || !email || !password) {
        return res.status(400).json({
            message: "Please fill up all required fields"
        });
    }

    const saltRounds = 10;

    try {
        // Retrieve course ID based on the course name
        const course = await Course.findOne({ _id: courseId });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ message: "Error hashing password" });
            }

            const serialNumber = await Students.countDocuments() + 1;

            const studentId = generateStudentId(studentShortCourseName, batchNumber, serialNumber);

            const newStudent = new Students({
                studentFirstName,
                studentLastName,
                studentCourse: course,
                img,
                email,
                password: hash,
                studentAttendance,
                id: studentId,
                courseId
            });

            newStudent.save()
                .then(async() => {
                    await Course.findByIdAndUpdate(
                        course._id,
                        { $push: { students: newStudent._id } },
                        { new: true }
                    );                    
                    res.status(201).json({ message: "Student added successfully", Id: studentId });
                })
                .catch((error) => {
                    res.status(500).json({ message: "Internal Server Error", error: error.message });
                });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

function updateAdminProfile(req, res) {
    const adminId = req.params.id; // Assuming you are passing the admin ID in the URL params
    const { adminFirstName, adminLastName, adminCnic, img, email } = req.body;

    if (!adminId || !adminFirstName || !adminCnic || !email) {
        return res.status(400).json({
            message: "Please provide the admin ID and fill up all required fields"
        });
    }

    Admin.findByIdAndUpdate(
        adminId,
        {
            $set: {
                adminFirstName,
                adminLastName,
                adminCnic,
                img,
                email,
            }
        },
        { new: true } // Return the updated document
    )
        .then(updatedAdmin => {
            if (!updatedAdmin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }
            res.status(200).json({
                message: "Admin profile updated successfully",
                admin: updatedAdmin
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        });
}

function deleteStudentProfile(req, res) {
    const studentId = req.params.id; // Assuming you are passing the student ID in the URL params

    if (!studentId) {
        return res.status(400).json({
            message: "Please provide the student ID"
        });
    }

    Students.findByIdAndDelete(studentId)
        .then(deletedStudent => {
            if (!deletedStudent) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }
            res.status(200).json({
                message: "Student profile deleted successfully",
                student: deletedStudent
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        });
}

function generateStudentId(courseShortName, batchNumber, serialNumber) {
    return `${courseShortName}-${batchNumber}-${serialNumber}`;
}


export {
    signupadmin,
    loginadmin,
    addCourse,
    updateCourse,
    addStudent,
    updateAdminProfile,
    deleteStudentProfile
}