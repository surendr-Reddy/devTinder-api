const express = require("express");
const requestRouter = express.Router();
const { connectionRequestModel } = require("../models/conntectionRequest");
requestRouter.get("/send/:status/:userId", async (req, res) => {
  const user = req.user;
  console.log(user);
  
  const touserId = req.params.userId;
  const status1 = req.params.status;
console.log(touserId,status1);

  const data = { formId: user._id, toId: touserId, status: status1 };
  const connectionRequest = new connectionRequestModel(
    data,
  );
  await connectionRequest.save();
  res.status(201).json({status:"success",message:"request sent successfuly",data:connectionRequest})
});
module.exports={ requestRouter };
