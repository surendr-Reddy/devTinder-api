const express = require("express");
const testfeedRequestRouter = express.Router();
const { connectionRequestModel } = require("../models/conntectionRequest");
const { User } = require("../models/UserModel");
const { default: mongoose } = require("mongoose");

testfeedRequestRouter.get("test/feed", async (req, res) => {
    try {
        // get the all the users from user model
        // the list should be exculde the loging user and the login user alredy sent request interseted/ignore/accpted/rejeted

        const loginUser = req.user

        const hideuserDetails = await connectionRequestModel.find({
            $or: [{ fromUserId: loginUser._id }, { toUserId: loginUser._id }]
        }).select("fromUserId toUserId -_id")
        const users = [];
        //Use forEach() when you just want to loop through elements without modifying or returning anything (e.g., logging, pushing values into an external array).
        //✅ Use map() when you need a new array with modified elements (e.g., doubling numbers, formatting strings).
        hideuserDetails.map((data) => {
            users.push(data.fromUserId.toString())
            users.push(data.toUserId.toString())
        })
        // users [
        //   '67a4fd3a8d823138253a35e9',
        //   '67a0f9560e63a078a4ea58ec',
        //   '67a4fd3a8d823138253a35e9',
        //   '67a0f96e0e63a078a4ea58ef',
        //   '67a4fd3a8d823138253a35e9',
        //   '67a2e95a0ee80f3c8be91be2'
        // ]
        const hindenUsers = new Set(users)
        // hindenUsers =Set(4) {
        //     '67a4fd3a8d823138253a35e9',
        //     '67a0f9560e63a078a4ea58ec',
        //     '67a0f96e0e63a078a4ea58ef',
        //     '67a2e95a0ee80f3c8be91be2'
        //   }
        // to convert Any object that can be looped over (like an array, string,other iterable structures such as Set, Map, etc 
        //Array.from(hindenUsers) 
        // will return array of  [
        //   '67a4fd3a8d823138253a35e9',
        //   '67a0f9560e63a078a4ea58ec',
        //   '67a0f96e0e63a078a4ea58ef',
        //   '67a2e95a0ee80f3c8be91be2'
        // ]
        const feedUsersExcludingConnection = await User.find({
            //This $and operator is unnecessary because MongoDB's .find() method already applies an implicit $and when multiple conditions are passed as separate key-value pairs.
            //const FeedUsers = await User.find({
            //     _id: { $nin: Array.from(hideSetList) },
            //     _id: { $ne: loginUser._id }
            // });
            // In MongoDB, if you provide multiple conditions as key-value pairs without $or or $and, MongoDB automatically treats them as AND conditions.
            $and: [
                {
                    _id: { $nin: Array.from(hindenUsers) }
                },
                {
                    _id: { $ne: loginUser._id }
                }
            ]
        }).select("firstName lastName ")
        // other logic without set
        // const hideusers = hideuserDetails.map((row) => 
        //     {
        //         //  if (row.fromUserId.toString() === loginUser._id.toString())
        //         if (row.fromUserId.equals(loginUser._id))
        //     {
        //         return row.toUserId
        //     }else {
        //         return row.fromUserId
        //     }
        //     })
        //     hideusers.push(loginUser._id)

        //     const userfeeddetails =await User.find({
        //         // _id:{$nin:[...hideusers]}
        //         // _id:{$nin:hideusers.map(id=>id)}
        //         _id:{$nin:hideusers.map((id)=>{
        //         // If `id` is a string, it will convert it to ObjectId. 
        //         // If `id` is already an ObjectId, it will just return the same ObjectId.
        //             return  new mongoose.Types.ObjectId(id)})}
        //     })
        res.status(201).json({ status: 'success', message: "successfuly fetched the user feed", data: { feedUsersExcludingConnection } })
    } catch (err) {
        res.status(500).json({ status: 'Error', meassage: "Error while fecthing the user feed", data: { type: err.type, Error: err.message } })
    }
})
module.exports = { testfeedRequestRouter }