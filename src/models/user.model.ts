import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

interface IUserModel extends mongoose.Document {
  firstname: string;
  dob: string;
  address: string;
  phone: string;
  state: string;
  zip: string;
  email: string;
  gender: string;
  userType: string;
}

const userSchema = new Schema(
  {
    firstname: { type: String },
    dob: { type: String },
    address: { type: String },
    phone: { type: String },
    state: { type: String },
    zip: { type: String },
    email: { type: String },
    gender: { type: String },
    userType: { type: String },
  }
)

const UserModel = mongoose.model<IUserModel>("user", userSchema);
export { IUserModel, UserModel };