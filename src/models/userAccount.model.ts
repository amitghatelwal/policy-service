import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

interface IUserAccountModel extends mongoose.Document {
  account_name: string;
  account_type: string;
}

const userAccountSchema = new Schema(
  {
    account_name: { type: String },
    account_type: { type: String }
  }
)

const UserAccountModel = mongoose.model<IUserAccountModel>("userAccount", userAccountSchema);
export { IUserAccountModel, UserAccountModel };