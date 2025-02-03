const express = require("express");
const requestRouter = express.Router();
const mongoose =require("mongoose")
const { connectionRequestModel } = require("../models/conntectionRequest");
const { User } = require("../models/UserModel")
requestRouter.get("/send/:status/:userId", async (req, res) => {
  try {
    const user = req.user;
    const userID = user._id


    const touserId = req.params.userId;
    const status = req.params.status;
    if (!status) {
      return res.status(400).json({ status: "Error", message: "status Not Found" })
    }
    const allowedFields = ["interested", 'ignore'];
    const isStatusAllowed = allowedFields.includes(status)



    if (!isStatusAllowed) {
      return res.status(400).json({ status: "Error", message: `status ${status} not Allowed` })
    }
    const isValidToUserId = await User.findById({ _id: touserId })
    if (!touserId || !isValidToUserId||mongoose.Types.ObjectId.isValid(touserId)) {
      return res.status(404).json({ status: "Error", message: "User Not Found!" })
    }
    // find() gives the return [] or array of result so used findone
    const existingConnectionRequest = await connectionRequestModel.findOne({
      $or: [{ fromUserId:userID, toUserId:touserId }, { fromUserId: touserId, toUserId: userID }]
    })
    console.log(existingConnectionRequest);


    if (existingConnectionRequest) {
      return res.status(400).json({ status: "Error", message: "Connection Request Already Exists!!" })
    }

    const data = { fromUserId: userID, toUserId: touserId, status: status };
    const connectionRequest = new connectionRequestModel(
      data,
    );
    await connectionRequest.save();
    res.status(201).json({ status: "success", message: "request sent successfuly", data: connectionRequest })
  } catch (err) {
    res.status(500).json({ status: "Error", message: "fail to send request", data: { Type: err.message } })
  }

});
module.exports = { requestRouter };
