const { ConnectionRequestModel } = require("../models/conntectionRequest");
const express = require("express")
const userRouter = express.Router();
// get all pending requestes
userRouter.get("/requests/received", async (req, res) => {
    try {
        const loginUser = req.user;
        const requestData = await ConnectionRequestModel.find({
            toUserId: loginUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"])
        if (!requestData.length > 0) {
            return res.status(404).json({ status: "Error", message: "No Request Found" })
        }
        const data = requestData.map((filed) => {
            const data = {
                documentId: filed._id,
                interestedUserId: filed.fromUserId._id,
                firstName: filed.fromUserId.firstName,
                lastName: filed.fromUserId.lastName,
                status: filed.status,
                toUserId: filed.toUserId
            }
            return data
        })
        res.status(201).json({ status: "success", message: "user request fetch succeful", Data: data })
    } catch (err) {
        res.status(500).json({ Status: "Error", Message: "Failed to send request", Error: err.message });
    }

})
// get the the accpeted connections
userRouter.get("/accpted/connections", async (req, res) => {
    try {
        // requment list
        //fetch the accpeted connetions requets
        //the query should be fromusedid(loginguser) and the status is "accpeted" this for the request sent by loging user and the other user accpeted
        // other query or condtion touserId  (loginuser) and the status is the the login user is recived the accpetd request from other user
        const loginUser = req.user
        const accptedRequests = await ConnectionRequestModel.find(
            {
                $or:
                    [{ fromUserId: loginUser._id, status: "accepted" },
                    { toUserId: loginUser._id, status: "accepted" }]
            }).populate("fromUserId", "skills firstName lastName").populate("toUserId", "firstName lastName")
        if (!accptedRequests.length > 0) {
            return res.status(404).json({ status: "Error", message: "No accpetd data Found" })
        }

        const data = accptedRequests.map(((inputdata) => {


            if (inputdata.fromUserId.equals(loginUser._id)) {
                const data = {
                    documentId: inputdata._id,
                    AccptedUserId: inputdata.toUserId._id,
                    firstName: inputdata.toUserId.firstName,
                    lastName: inputdata.toUserId.lastName,
                    status: inputdata.status,
                    toUserId: inputdata.fromUserId,
                }
                return data

            } else {
                const data = {
                    documentId: inputdata._id,
                    AccptedUserId: inputdata.fromUserId._id,
                    firstName: inputdata.fromUserId.firstName,
                    lastName: inputdata.fromUserId.lastName,
                    status: inputdata.status,
                    toUserId: inputdata.toUserId,
                }
                return data

            }
        }))

        res.status(201).json({ status: "success", message: "user request fetch succeful", Data: data })
    } catch (err) { res.status(500).json({ Status: "Error", Message: "Failed to send request", Error: err.message }); }
})
module.exports = { userRouter }