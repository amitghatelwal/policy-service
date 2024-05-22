import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

interface IPolicyModel extends mongoose.Document {
  policy_number: string;
  policy_start_date: string;
  policy_end_date: string;
  policyCategoryId: string;
  companyId: string;
  userId: string;
}

const policySchema = new Schema(
  {
    policy_number: { type: String, index: true, unique: true },
    policy_start_date: { type: String },
    policy_end_date: { type: String },
    policyCategoryId: { type: String },
    companyId: { type: String },
    userId: { type: String }
  }
)

const PolicyModel = mongoose.model<IPolicyModel>("policy", policySchema);
export { IPolicyModel, PolicyModel };

// 6. Policy Info -  policy_number, policy_start_date, policy_end_date, <policy category- collection id>, <company collection id>, and <user-collection id>
