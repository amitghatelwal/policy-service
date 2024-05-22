import { injectable } from "inversify";
import { Stream } from 'stream';
import parser from 'csv-parser';
import { Worker } from 'worker_threads';

@injectable()
export class PolicyService {
  constructor() {
  }

  async processCsvData(fileBuffer: any) {
    const csvData = await this.getDataFromBuffer(fileBuffer);
    const dataFromWorker = await this.postMsgToWorker(csvData);
    return dataFromWorker;
  }

  async postMsgToWorker(data: any) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./src/services/worker.js', {
        workerData: {
          value: data,
          path: './worker.ts'
        }
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
      });
      worker.on('message', (result) => {
        console.log('result is here from worker - ', result);
        resolve(result);
      });
    });
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
