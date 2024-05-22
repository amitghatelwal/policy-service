import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

interface ILobCatergoryModel extends mongoose.Document {
  category_name: string;
}

const lobCatergorySchema = new Schema(
  {
    category_name: { type: String }
  }
)

const LobCatergoryModel = mongoose.model<ILobCatergoryModel>("lobCatergory", lobCatergorySchema);
export { ILobCatergoryModel, LobCatergoryModel };