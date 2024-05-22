import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

interface IPolicyCarrierModel extends mongoose.Document {
  company_name: string;
}

const policyCarrierSchema = new Schema(
  {
    company_name: { type: String }
  }
)

const PolicyCarrierModel = mongoose.model<IPolicyCarrierModel>("policyCarrier", policyCarrierSchema);
export { IPolicyCarrierModel, PolicyCarrierModel };
