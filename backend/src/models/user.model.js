import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      default: ""
    },
    age:{
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      required: true,
    },
    hobbies: {
      type: [String],
      default: [],
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    relationshipType: {
      type: String,
      enum: ["monogamy", "polygamy", "still figuring it out"],
      default: "still figuring it out",
    },
    interest: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    smoking: {
      type: String,
      enum: ["yes", "no", "sometimes"],
      default: "no",
    },
    drinking: {
      type: String,
      enum: ["yes", "no", "sometimes"],
      default: "no",
    },
    drugs: {
      type: String,
      enum: ["yes", "no", "sometimes"],
      default: "no",
    },
    religion: {
      type: String,
      default: "",
    },
    likesDone: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    likesRecieved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      },
    ],
    conversations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
