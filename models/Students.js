import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentFirstName: {
      type: String,
      required: true,
    },
    studentLastName: {
      type: String,
    },
    studentCourse: {
      type: String,
      require: true
    },
    img: {
      type: String,
    },
    email: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    comesInAt: {
      type: Array
    },
    comesOutAt: {
      type: Array
    },
    absent: {
      type: Array
    },
    id: {
      type: String,
      require: true
    },
    courseId: {
      type: String,
      require: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("student", studentSchema);
