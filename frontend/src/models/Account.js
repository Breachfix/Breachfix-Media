import mongoose from "mongoose";

const NewAccountSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    pin: { type: String, required: true },
  },
  { timestamps: true }
);

const Account =
  mongoose.models.UserAccount || mongoose.model("UserAccount", NewAccountSchema);

export default Account;
