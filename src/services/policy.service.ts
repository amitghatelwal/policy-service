import { injectable } from "inversify";
import { Stream } from 'stream';
import parser from 'csv-parser';
import { Worker } from 'worker_threads';
import { UserModel } from "../models/user.model";
import { AgentModel } from "../models/agent.model";
import { LobCatergoryModel } from "../models/lob-category.model";
import { PolicyCarrierModel } from "../models/policyCarrier.model";
import { PolicyModel } from "../models/policy.model";
import { UserAccountModel } from "../models/userAccount.model";

@injectable()
export class PolicyService {
  constructor() {
  }

  async processCsvData(fileBuffer: any) {
    const csvData = await this.getDataFromBuffer(fileBuffer);
    const dataFromWorker = await this.postMsgToWorker(csvData);
    await this.saveDataToMongo(dataFromWorker);
    return dataFromWorker;
  }

  async saveDataToMongo(dataFromWorker: any) {
    const mongoPromises = [
      AgentModel.insertMany(dataFromWorker.arrOfAgents),
      LobCatergoryModel.insertMany(dataFromWorker.arrOfLobCategory),
      PolicyCarrierModel.insertMany(dataFromWorker.arrOfCompany),
      PolicyModel.insertMany(dataFromWorker.arrOfPolicies),
      UserModel.insertMany(dataFromWorker.arrOfUsers),
      UserAccountModel.insertMany(dataFromWorker.arrOfUserAccounts)
    ]
    return await Promise.all(mongoPromises);
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
        resolve(result);
      });
    });
  }

  async searchWithUsername(firstname: string) {
    const result = await UserModel.aggregate([
      {
        $match: {
          firstname
        }
      },
      {
        $lookup: {
          from: "policies",
          let: {
            userId: "$userId"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"]
                }
              }
            }
          ],
          as:"policies"
        }
      },
      {
        $unwind: {
          path: "$policies"
        }
      },
      {
        $set: {
          policy_number: "$policies.policy_number",
          policy_start_date: '$policies.policy_start_date',
          policy_end_date: '$policies.policy_end_date',
          policyCategoryId: '$policies.policyCategoryId',
          companyId: '$policies.companyId',
          userId: '$policies.userId',
        }
      },
      {
        $project: {
          _id: 0,
          policies: 0
        }
      }
    ]);

    return result.length ? result[0] : {};
  }

  async policyOfEachUser() {
    const result = await UserModel.aggregate([
      {
        $lookup: {
          from: "policies",
          let: {
            userId: "$userId"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"]
                }
              }
            }
          ],
          as:"policies"
        }
      },
      {
        $unwind: {
          path: "$policies"
        }
      },
      {
        $set: {
          policy_number: "$policies.policy_number",
          policy_start_date: '$policies.policy_start_date',
          policy_end_date: '$policies.policy_end_date',
          policyCategoryId: '$policies.policyCategoryId',
          companyId: '$policies.companyId',
          userId: '$policies.userId',
        }
      },
      {
        $project: {
          _id: 0,
          policies: 0
        }
      }
    ]);
    console.log('er is ata - ',result);
    return result;
  }

  async getData(reqData: any) {
    return await UserModel.find({}, {}, reqData);
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
