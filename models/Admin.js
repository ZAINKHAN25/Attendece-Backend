import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    adminFirstName: {
      type: String,
      required: true,
    },
    adminLastName: {
      type: String,
    },
    adminCnic: {
      type: String,
      max: 15,
      min: 13
    },
    img: {
      type: String,
    },
    email: {
      type: String,
      require: true
    },
    password:{
        type: String,
        require: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("admin", adminSchema);