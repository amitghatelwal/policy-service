import { Request, Response } from "express";
import { controller, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { PolicyService } from "../services/policy.service";
import { inject } from "inversify";
import { Constants } from "../utils/Constants";
import multer from 'multer';
import { PolicyModel } from "../models/policy.model";

@controller(`${Constants.CONTEXT_PATH}/${Constants.GROCERY}`)
export class PolicyController {
  constructor(@inject(PolicyService) private policyService: PolicyService) {}

  /**
   * @param req skip, limit, search in query
   * @returns Array
   */
  @httpPost("/uploadData", multer().any())
  async getItems(req: Request, res: Response) {
    try {
      // console.log('file data - ',req.files);
      const filesData: any = req.files;
      const dataFromWorker: any = await this.policyService.processCsvData(filesData[0].buffer);
      // console.log('data from worker - ', dataFromWorker);
      // await PolicyModel.create(dataFromFile[0]);
      // console.log("dataof file - ", dataFromFile);
      return { msg:'success' };
    } catch (err) {
      return this.policyService.handleError(err, 'getItems');
    }
  }
}

// to upload CSV data into MongoDB using worker threads