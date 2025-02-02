const { mongoose } = require("mongoose");

const connectionRequest = mongoose.Schema(
  {
    formId: { type: String, required: true },
    toId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["interested", "ignore"],
    //   validate: {
    //     validetor: (vaule) => {
    //       const allwedfiled = ["interested", "ignore"];
    //       const isvalid = allwedfiled.each((filed) => {
    //         vaule.incudels(filed);
    //       });
    //       return isvalids;
    //     },
    //     message: "invalid status",
    //   },
    },
  },
  { timeStamp: true }
);
const connectionRequestModel=mongoose.model("connectionRequest",connectionRequest)
module.exports={connectionRequestModel}