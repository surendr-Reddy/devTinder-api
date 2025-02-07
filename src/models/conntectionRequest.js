const { mongoose } = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    toUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: {
      type: String,
      required: true,
      // enum: {
      //   values: ["ignored", "interested", "accepted", "rejected"],
      //   message: `{VALUE} is incorrect status type`,
      // },
      // enum: ["interested", "ignore"],
      validate: {
        validator: (vaule) => {
          const allwedfiled = ["interested", "ignore", "accepted", "rejected"];
          const isvalid = allwedfiled.includes(vaule) //the vaule single string so we can use this but if it is array then use bellow
          //   const isvalid = allwedfiled.some((filed) => {
          //     vaule.includes(filed); // here the vaule is string so we cant use the .includes
          //   });
          return isvalid;
        },
        message: "invalid status",
      },
    },
  },
  //the keys should be in small laters
  { timestamps: true }
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});
const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = { ConnectionRequestModel }