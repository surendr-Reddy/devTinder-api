const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const { connectionRequestModel } = require("../models/conntectionRequest");
const { User } = require("../models/UserModel");

requestRouter.post("/send/:status/:userId", async (req, res) => {
  try {
    const user = req.user;
    const userID = user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    // Validate status
    const allowedStatuses = ["interested", "ignore"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ status: "Error", message: `Invalid status: ${status}` });
    }

    // Validate User ID
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ status: "Error", message: "Invalid User ID format!" });
    }

    const isValidToUser = await User.findById(toUserId);
    if (!isValidToUser) {
      return res.status(404).json({ status: "Error", message: "User Not Found!" });
    }

    // Check if connection request already exists used shot hand variables (must be same as schema then we can use shorthand)
    const existingConnectionRequest = await connectionRequestModel.findOne({
      $or: [{ fromUserId: userID, toUserId }, { fromUserId: toUserId, toUserId: userID }]
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ status: "Error", message: "Connection Request Already Exists!" });
    }

    // Create a new connection request
    const connectionRequest = new connectionRequestModel({
      fromUserId: userID,
      toUserId,
      status
    });

    await connectionRequest.save();
    res.status(201).json({ Status: "Success", Message: "Request sent successfully", Data: connectionRequest });

  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: "Error", Message: "Failed to send request", Error: err.message });
  }
});

module.exports = { requestRouter };
