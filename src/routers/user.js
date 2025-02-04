const { connectionRequestModel } = require("../models/conntectionRequest");
const express = require("express")
const userRouter = express.Router();

userRouter.get("/requests/received", async (req, res) => {
    try {
        const loginUser = req.user;
        const requestData = await connectionRequestModel.find({
            toUserId: loginUser._id,
            status: "interested"
        }).populate("fromUserId",["firstName","lastName"])
        console.log("requestDATA",requestData,loginUser._id);
        
        if (!requestData.length>0) {
            return res.status(404).json({ status: "Error", message: "No Request Found" })
        }
        res.status(201).json({ status: "success", message: "user request fetch succeful", Data: requestData })
    } catch (err) { 
        res.status(500).json({ Status: "Error", Message: "Failed to send request", Error: err.message });
    }

})
module.exports={userRouter}