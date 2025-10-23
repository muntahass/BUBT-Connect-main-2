import imagekit from "../configs/imageKit.js";
import { inngest } from "../inngest/index.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import User from "../models/user.js";
import fs from "fs";
// Get User Data using userId
export const getUserData = async (req, res) => {
  try {
    // ✅ req.auth() থেকে userId নিচ্ছে
    const { userId } = await req.auth();

    // ✅ যদি userId না থাকে, মানে authenticate হয়নি
    if (!userId) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    // ✅ Database থেকে user খুঁজছে
    const user = await User.findById(userId);

    // ✅ user না পেলে message পাঠাবে
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ সব ঠিক থাকলে user data পাঠাবে
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update User Data
export const updateUserData = async (req, res) => {
  try {
    // userId নেয়া হচ্ছে authentication থেকে
    const { userId } = req.auth();

    // user update এর জন্য প্রয়োজনীয় ডাটা নেয়া হচ্ছে request body থেকে
    let { username, bio, location, full_name } = req.body;

    // পুরনো user ডাটা বের করছি database থেকে
    const tempUser = await User.findById(userId);

    if (!tempUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // username না পাঠালে পুরনো username রাখবে
    if (!username) username = tempUser.username;

    // যদি নতুন username আগেরটার থেকে আলাদা হয়
    if (tempUser.username !== username) {
      const userExists = await User.findOne({ username });

      // যদি username আগে থেকেই থাকে, তাহলে আগেরটা রেখে দিবে
      if (userExists) {
        username = tempUser.username;
      }
    }

    // আপডেট করার নতুন ডাটা তৈরি করছি
    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });

      updatedData.profile_picture = url;
    }

    //coverrr

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });

      updatedData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.json({ success: true, user, message: "Profile updated successfully" });

    // ডাটাবেজে আপডেট করা হচ্ছে
    //const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    // new: true,
    //});

    // সফল হলে response পাঠানো
    //res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Find Users using username, email, location, full_name
export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth(); // Get current logged-in user's ID
    const { input } = req.body; // Get search input from request body

    // Search users by username, email, full_name, or location (case-insensitive)
    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    // Filter out the current user
    const filteredUsers = allUsers.filter(
      (user) => user._id.toString() !== userId
    );

    // Send response
    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Follow User
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    const user = await User.findById(userId);

    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You are already following this user",
      });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    res.json({ success: true, message: "Now you are following this user" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    user.following = user.following.filter((user) => user !== id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter((user) => user !== userId);
    await toUser.save();

    res.json({
      success: true,
      message: "You are no longer following this user",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//send connection request

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    // Check if user has sent more than 20 connection requests in the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const connectionRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gt: last24Hours }, // ✅ Correct field name
    });

    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message:
          "You have sent more than 20 connection requests in the last 24 hours",
      });
    }

    // Check if connection already exists (either direction)
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!connection) {
      const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      await inngest.send({
        name: "app/connection-request",
        data: { connectionId: newConnection._id },
      });

      return res.json({
        success: true,
        message: "Connection request sent successfully",
      });
    } else if (connection && connection.status === "accepted") {
      return res.json({
        success: false,
        message: "You are already connected with this user",
      });
    } else {
      return res.json({
        success: false,
        message: "Connection request is already pending",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER CONNECTIONS
export const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId)
      .populate("connections")
      .populate("followers")
      .populate("following");

    const pendingConnectionsData = await Connection.find({
      to_user_id: userId,
      status: "pending",
    }).populate("from_user_id");

    const pendingConnections = pendingConnectionsData.map(
      (conn) => conn.from_user_id
    );

    res.json({
      success: true,
      connections: user.connections,
      followers: user.followers,
      following: user.following,
      pendingConnections,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Accept Connection Request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
    });

    if (!connection) {
      return res.json({ success: false, message: "Connection not found" });
    }

    const user = await User.findById(userId);
    user.connections.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.connections.push(userId);
    await toUser.save();

    connection.status = "accepted";
    await connection.save();

    res.json({
      success: true,
      message: "Connection accepted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get User Profiles
export const getUserProfiles = async (req, res) => {
  try {
    const { profileId } = req.body;

    const profile = await User.findById(profileId);
    if (!profile) {
      return res.json({ success: false, message: "Profile not found" });
    }

    const posts = await Post.find({ user: profileId }).populate("user");

    return res.json({ success: true, profile, posts });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
