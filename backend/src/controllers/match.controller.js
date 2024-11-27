import Like from "../models/like.model.js";
import Match from "../models/matches.model.js";
import User from "../models/user.model.js";

export const likeAUser = async (req, res) => {
  const userId = req.user._id;
  const likedUserId = req.params.id;

  try {
    const user = await User.findById(userId);
    const likedUser = await User.findById(likedUserId);

    if (!user || !likedUser) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }

    if (
      user.likesDone.includes(likedUserId) ||
      likedUser.likesRecieved.includes(userId)
    ) {
      return res
        .status(400)
        .json({ code: 0, message: "Already liked this user" });
    }
    if (user._id.toString() === likedUser._id.toString()) {
      return res.status(400).json({ code: 0, message: "Cannot like yourself" });
    }

    const newLike = new Like({
      userId: user._id,
      likedUserId: likedUser._id,
    });
    await newLike.save();

    user.likesDone.push(likedUserId);
    likedUser.likesRecieved.push(userId);

    await user.save();
    await likedUser.save();
    const mutualLike = likedUser.likesDone.includes(user._id);
    if (mutualLike) {
      const newMatch = new Match({
        userId: user._id,
        matchedUserId: likedUser._id,
      });
      await newMatch.save();

      user.matches.push(newMatch._id);
      likedUser.matches.push(newMatch._id);

      await user.save();
      await likedUser.save();

      return res.status(200).json({ code: 1, message: "Match found!" });
    }

    return res
      .status(200)
      .json({ code: 1, message: "Like added successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 0, message: "Error in liking user" });
  }
};

export const getMatchedUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId)
      .populate("matches")
      .populate({
        path: "matches",
        populate: { path: "matchedUserId", model: "User", select: "-password" },
      })
      .select("-password");
    if (!user) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }
    const users = await User.findById(userId).select("-password");
    return res
      .status(200)
      .json({ code: 1, message: "Matched Users", users: user.matches });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in getting matched users" });
  }
};

export const getAllLikedUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate({
      path: "likesRecieved",
      model: "User",
      select: "-password",
    });

    if (!user) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }

    return res.status(200).json({
      code: 1,
      message: "Liked Users",
      users: user.likesRecieved,
    });
  } catch (error) {
    console.error("Error in getting all liked users:", error);
    return res.status(500).json({
      code: 0,
      message: "Error in getting all liked users",
    });
  }
};

export const unMatchUser = async (req, res) => {
  const userID = req.user._id;
  const { id } = req.params;

  try {
    const user = await User.findById(userID);
    const matchedUser = await User.findById(id);

    if (!user || !matchedUser) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }

    if (!user.matches.includes(id) || !matchedUser.matches.includes(userID)) {
      return res
        .status(400)
        .json({ code: 0, message: "You are not matched with this user" });
    }

    user.matches = user.matches.filter((match) => match.toString() !== id);
    matchedUser.matches = matchedUser.matches.filter(
      (match) => match.toString() !== userID
    );

    await Promise.all([user.save(), matchedUser.save()]);

    return res
      .status(200)
      .json({ code: 1, message: "User unmatched successfully" });
  } catch (error) {
    console.error("Error in unmatching user:", error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in unmatching user" });
  }
};

export const showPotentialMatches = async (req, res) => {
  const userId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: userId } }).select("-password");
    return res
      .status(200)
      .json({ code: 1, message: "users fetched successfully", users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in show potential matches" });
  }
};
export const showMaleMatches = async (req, res) => {
  const userId = req.user._id;
  try {
    const users = await User.find({
      gender: "male",
      _id: { $ne: userId },
    }).select("-password");
    return res
      .status(200)
      .json({ code: 1, message: "Male users fetched successfully", users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in show male matches" });
  }
};
export const showFemaleMatches = async (req, res) => {
  const userId = req.user._id;
  try {
    const users = await User.find({
      gender: "female",
      _id: { $ne: userId },
    }).select("-password");
    return res
      .status(200)
      .json({ code: 1, message: "Male users fetched successfully", users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in show male matches" });
  }
};
export const showMatchesOnAge = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    const matches = await User.find({
      _id: { $ne: _id },
      age: { $gte: minAge, $lte: maxAge },
    }).select("-password");
    if (matches.length === 0) {
      return res
        .status(200)
        .json({ code: 1, message: "No matches found", matches: [] });
    }
    return res
      .status(200)
      .json({ code: 1, message: "Matches fetched successfully", matches });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in show matches on age" });
  }
};

export const matchBasedOnHeight = async(req,res)=>{
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    const matches = await User.find({
      _id: { $ne: _id },
      height: { $gte: minHeight},
    }).select("-password");
    if (matches.length === 0) {
      return res
       .status(200)
       .json({ code: 1, message: "No matches found", matches: [] });
    }
    return res
     .status(200)
     .json({ code: 1, message: "Matches fetched successfully", matches });
  } catch (error) {
    console.log(error);
    return res
     .status(500)
     .json({ code: 0, message: "Error in show matches on height" });
  }
}