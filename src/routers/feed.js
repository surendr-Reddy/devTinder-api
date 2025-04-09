const express = require("express");
const { ConnectionRequestModel } = require("../models/conntectionRequest");
const { User } = require("../models/UserModel");
const feedRouter = express.Router();
feedRouter.get("/feed", async (req, res) => {
    try {
        const loginUser = req.user
        const page = parseInt(req.query.page) || 1
        // to check the vaule is true or false if vaule 0 then parseInt(req.query.page) retrun 0 and then 0 consider as false so or oparter will consider 1 vaule even page=0
        // console.log(Boolean(parseInt(req.query.page))); // false for page=0

        let limit = req.query.limit || 10
        limit = limit > 50 ? 50 : limit
        //  const skip=(page*limit) for page 0
        if (req.query.page <= 0) {
            res.status(400).json({
                status: "Error",
                message: "pages should be graterthen 0",
            });
        }
        const skip = (page - 1) * limit


        const hideUsers = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loginUser._id },
                { toUserId: loginUser._id }
            ]
        }).select("fromUserId toUserId")
        const hideSetList = new Set();
        hideUsers.forEach(element => {
            hideSetList.add(element.formUserId);
            hideSetList.add(element.toUserId);
        });
        const FeedUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideSetList) } },
                { _id: { $ne: loginUser._id } }
            ]
        }).select("firstName lastName")
            .skip(skip)
            .limit(limit)
        res.status(200).json({
            status: "success",
            message: "Successfully fetched the user feed",
            data: { FeedUsers }
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: "Error while fetching the user feed",
            data: { type: err.name, error: err.message }
        });
    }
})
module.exports = { feedRouter }