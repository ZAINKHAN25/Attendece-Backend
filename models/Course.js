import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseShortName: {
      type: String,
      required: true
    },
    courseBatch: {
        type: String,
        required: true,
    },
    courseTeacher: {
        type: String,
        required: true,
    },
    courseDays: {
        type: Array,
        required: true,
    },
    courseTiming: {
        type: Array,
        required: true,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],
    attendance: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
      status: {
        type: String,
        enum: ['present', 'absent'],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
