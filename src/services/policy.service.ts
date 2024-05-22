import { injectable } from "inversify";
import { dbConnection } from "../../server";
import { Constants } from "../utils/Constants";
import { Stream } from 'stream';
import { PassThrough } from 'stream';
import parser from 'csv-parser';

@injectable()
export class PolicyService {
  constructor() {
  }

  async getItems(reqData: any) {

  }

  async handleError(err: any, errId = '') {
    console.log(`[${errId}]Error occured - `, err.errMsg || err.msg || err.sqlMessage, err);
    return { status: 'error', msg: err.errMsg || err.msg || err.sqlMessage }
  }

  getDataFromBuffer(bufferData: any) {
    const dataFromBuffer: Array<any> = [];
    const stream = Stream.Readable.from(bufferData);
    return new Promise((resolve, reject) => {
      stream.pipe(parser()).on("data",(data: any)=>{
        console.log(data);
        dataFromBuffer.push(data);
      }).on("error", (error: any) => {
        reject(error)
      }).on('finish', (data: any)=> {
        console.log("fininshed - ", data);
        resolve(dataFromBuffer);
      });
    });
  }
}
