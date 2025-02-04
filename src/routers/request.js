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
requestRouter.post("/review/:status/:requestId", async (req, res) => {
  try {
    // requirement list
    // validate the status and requestId
    // status should be 'accepted' or 'rejected'
    // the requestId is the actual ID of the connectionRequest model
    // the logined user is  the same as the  tousedid in the connectionrequest model   -- this is used  to change the status of the user  status('accepted' or 'rejected') in the connectonrequest model db
    // feth the document with requestId and touser=loginused and status="intrested"
    // this API is only for changing the status that was already sent by another user, so the 'toUserId' is the logged-in user, and this logged-in user can change the status from 'interested' to 'accepted' or 'rejected' based on this logic
  const loginUser= req.user
  const {status,requestId} = req.params
  const allowedStatus=["accepted","rejected"]
  if(!allowedStatus.includes(status)){
    return res.status(400).json({status:"Error",message:"invalid status Type"})
  }
  if(!mongoose.Types.ObjectId.isValid(requestId)){
    return res.status(400).json({ status: "Error", message: "Invalid Request ID format!" });
  }
  const reviewRequest= await connectionRequestModel.findOne({
    _id:requestId,
    toUserId:loginUser._id,
    status:"interested"
  })
  if(!reviewRequest){
    return res.status(400).json({ status: "Error", message: "ConnectionRequest Not Found!" });
  }
  reviewRequest.status=status;
  await reviewRequest.save()
  res.status(201).json({ status: "success", message: "ConnectionRequest sent succesfuly",data:reviewRequest });
   } catch (err) { 
    res.status(500).json({ Status: "Error", Message: "Failed to send request", Error: err.message });
   }
})

module.exports = { requestRouter };
