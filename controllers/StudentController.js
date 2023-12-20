import Students from "../models/Students.js";
import Courses from "../models/Course.js";
import bcrypt from 'bcrypt';


function loginstudent(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide both email and password"
        });
    }
    Students.findOne({ email })
        .then(student => {
            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            // Compare the provided password with the hashed password stored in the database
            bcrypt.compare(password, student.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Internal Server Error",
                        error: err.message
                    });
                }

                if (result) {
                    // Passwords match, generate a token or session to represent a logged-in state
                    // You may use a library like JWT for token generation

                    return res.status(200).json({
                        message: "Login successful",
                        // Include any additional data or tokens here if needed
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

function searchstudent(req, res) {
    const { query } = req.params;

    if (!query) {
        return res.status(400).json({
            message: "Please provide a search query"
        });
    }

    // Use a regular expression to perform a case-insensitive search on the student names or other fields
    const searchRegex = new RegExp(query, 'i');

    Students.find({
        $or: [
            { studentFirstName: searchRegex },
            { studentLastName: searchRegex },
            { email: searchRegex },
            // Add other fields you want to include in the search
        ]
    })
    .then(results => {
        res.status(200).json({
            message: "Search successful",
            results
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    });
}

function getallstudent(req, res) {
    Students.find()
        .then(students => {
            res.status(200).json({
                message: "Students retrieved successfully",
                students
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        });
}

function updateStudentProfile(req, res) {
    const studentId = req.params.id; // Assuming you are passing the student ID in the URL params
    const { studentFirstName, studentLastName, studentCourse, img, email } = req.body;

    if (!studentId || !studentFirstName || !studentCourse || !email) {
        return res.status(400).json({
            message: "Please provide the student ID and fill up all required fields"
        });
    }

    Students.findByIdAndUpdate(
        studentId,
        {
            $set: {
                studentFirstName,
                studentLastName,
                studentCourse,
                img,
                email,
            }
        },
        { new: true } // Return the updated document
    )
    .then(updatedStudent => {
        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        res.status(200).json({
            message: "Student profile updated successfully",
            student: updatedStudent
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    });
}

function markInAttendance(req, res) {
    const studentId = req.params.id; // Assuming you are passing the student ID in the URL params

    if (!studentId) {
        return res.status(400).json({
            message: "Please provide the student ID"
        });
    }

    const currentTimestamp = new Date();

    // Update student's attendance
    Students.findByIdAndUpdate(
        studentId,
        {
            $push: {
                comesInAt: {
                    status: "Mark in",
                    timestamp: currentTimestamp
                }
            }
        },
        { new: true }
    )
    .then(updatedStudent => {
        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Update course's attendance
        const courseId = updatedStudent.courseId; // Assuming you store the course ID in the student model

        Courses.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    attendance: {
                        student: updatedStudent._id,
                        status: "Mark in",
                        timestamp: currentTimestamp
                    }
                }
            },
            { new: true }
        )
        .then(updatedCourse => {
            if (!updatedCourse) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            res.status(200).json({
                message: "Attendance marked in as present",
                student: updatedStudent,
                course: updatedCourse
            });
        })
        .catch(courseError => {
            res.status(500).json({
                message: "Error updating course attendance",
                error: courseError.message
            });
        });
    })
    .catch(studentError => {
        res.status(500).json({
            message: "Error updating student attendance",
            error: studentError.message
        });
    });
}

function markOutAttendence(req, res) {
    const studentId = req.params.id; // Assuming you are passing the student ID in the URL params

    if (!studentId) {
        return res.status(400).json({
            message: "Please provide the student ID"
        });
    }

    const currentTimestamp = new Date();

    // Update student's attendance
    Students.findByIdAndUpdate(
        studentId,
        {
            $push: {
                comesOutAt: {
                    status: "Mark out",
                    timestamp: currentTimestamp
                }
            }
        },
        { new: true }
    )
    .then(updatedStudent => {
        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Update course's attendance
        const courseId = updatedStudent.courseId; // Assuming you store the course ID in the student model

        Courses.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    attendance: {
                        student: updatedStudent._id,
                        status: "mark out",
                        timestamp: currentTimestamp
                    }
                }
            },
            { new: true }
        )
        .then(updatedCourse => {
            if (!updatedCourse) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            res.status(200).json({
                message: "Attendance marked out as present",
                student: updatedStudent,
                course: updatedCourse
            });
        })
        .catch(courseError => {
            res.status(500).json({
                message: "Error updating course attendance",
                error: courseError.message
            });
        });
    })
    .catch(studentError => {
        res.status(500).json({
            message: "Error updating student attendance",
            error: studentError.message
        });
    });
}

function absentStudent(req, res) {
    const studentId = req.params.id; // Assuming you are passing the student ID in the URL params

    if (!studentId) {
        return res.status(400).json({
            message: "Please provide the student ID"
        });
    }

    const currentTimestamp = new Date();

    // Update student's attendance
    Students.findByIdAndUpdate(
        studentId,
        {
            $push: {
                absent: {
                    status: "absent",
                    timestamp: currentTimestamp
                }
            }
        },
        { new: true }
    )
    .then(updatedStudent => {
        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Update course's attendance
        const courseId = updatedStudent.courseId; // Assuming you store the course ID in the student model

        Courses.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    attendance: {
                        student: updatedStudent._id,
                        status: "absent",
                        timestamp: currentTimestamp
                    }
                }
            },
            { new: true }
        )
        .then(updatedCourse => {
            if (!updatedCourse) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            res.status(200).json({
                message: "Attendance marked as absent",
                student: updatedStudent,
                course: updatedCourse
            });
        })
        .catch(courseError => {
            res.status(500).json({
                message: "Error updating course attendance",
                error: courseError.message
            });
        });
    })
    .catch(studentError => {
        res.status(500).json({
            message: "Error updating student attendance",
            error: studentError.message
        });
    });
}


export {
    loginstudent,
    searchstudent,
    getallstudent,
    updateStudentProfile,
    markInAttendance,
    markOutAttendence,
    absentStudent
}