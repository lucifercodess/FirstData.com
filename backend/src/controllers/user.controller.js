import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { genTokenAndSetCookie } from "../configs/jwt.config.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  const { name, email, password, phone, gender, dob, age } = req.body;
  try {
    if (!name || !email || !password || !phone || !gender || !age) {
      return res
        .status(400)
        .json({ code: 0, message: "All fields are required" });
    }
    const userExists = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (userExists) {
      return res.status(400).json({
        code: 0,
        message:
          userExists.email === email
            ? "Email is already registered"
            : "Phone number is already registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    if (hashPassword) {
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        phone,
        gender,
        age,
      });
      await newUser.save();
      genTokenAndSetCookie(newUser._id, res);
      const user = await User.findById(newUser._id).select("-password");

      return res
        .status(200)
        .json({ code: 1, message: "User registered successfully", user });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, messsage: "error in register controller" });
  }
};

export const afterEmailRegisterQuestions = async (req, res) => {
  const {
    hobbies,
    interest,
    relationshipType,
    height,
    smoking,
    drinking,
    drugs,
    religion,
  } = req.body;

  const profilePhoto = req.file;

  try {
    const user = await User.findById(req.user._id);
    user.hobbies = hobbies;
    user.interest = interest;
    user.relationshipType = relationshipType;
    user.height = height;
    user.smoking = smoking;
    user.drinking = drinking;
    user.drugs = drugs;
    user.religion = religion;
    if (profilePhoto && !profilePhoto.mimetype.startsWith("image/")) {
      return res.status(400).json({
        code: 0,
        message: "Invalid file type. Only images are allowed.",
      });
    }

    if (profilePhoto) {
      let result = await cloudinary.uploader.upload(profilePhoto.path);
      let imageUrl = result.secure_url;
      user.profilePhoto = imageUrl;
    }
    await user.save();
    res.json({ code: 1, message: "User details added successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "error in saving user details" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email: email });
    console.log(userExists);
    if (!userExists) {
      return res.status(400).json({ code: 0, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).json({ code: 0, message: "Incorrect password" });
    }
    genTokenAndSetCookie(userExists._id, res);
    const user = await User.findById(userExists._id).select("-password");
    return res
      .status(200)
      .json({ code: 1, message: "User logged in successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "error in login controller" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("date");
    res.status(200).json({ code: 1, message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "error in logout controller" });
  }
};

export const updateImportantProfileDetails = async (req, res) => {
  const userId = req.user._id;
  const { name, email, phone, gender } = req.body;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
      _id: { $ne: user._id },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ code: 0, message: "Email or phone number already exists" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.gender = gender;
    await user.save();
    return res
      .status(200)
      .json({ code: 1, message: "profile Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "error in update important profile details" });
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ code: 0, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findById(req.user._id);
    user.profilePhoto = result.secure_url;
    await user.save();

    return res
      .status(200)
      .json({ code: 1, message: "Profile photo updated", user });
  } catch (error) {
    console.error("Error in updateProfilePhoto:", error);
    res.status(500).json({ code: 0, message: "Internal server error" });
  }
};

export const updateNonImportantFields = async (req, res) => {
  const {
    hobbies,
    interest,
    relationshipType,
    height,
    smoking,
    drinking,
    drugs,
    religion,
  } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }
    user.hobbies = hobbies;
    user.interest = interest;
    user.relationshipType = relationshipType;
    user.height = height;
    user.smoking = smoking;
    user.drinking = drinking;
    user.drugs = drugs;
    user.religion = religion;
    await user.save();
    return res
      .status(200)
      .json({ code: 1, message: "updated successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "error in update non important fields" });
  }
};

export const updatePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ code: 0, message: "Incorrect current password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ code: 1, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "error in update password" });
  }
};
