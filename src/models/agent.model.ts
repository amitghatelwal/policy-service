import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

interface IAgentModel extends mongoose.Document {
  agentName: string;
}

const agentSchema = new Schema(
  {
    agentName: { type: String },
  }
)

const AgentModel = mongoose.model<IAgentModel>("agent", agentSchema);
export { IAgentModel, AgentModel };