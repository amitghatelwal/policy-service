import { Request, Response } from "express";
import { controller, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { PolicyService } from "../services/policy.service";
import { inject } from "inversify";
import { Constants } from "../utils/Constants";
import multer from 'multer';

@controller(`${Constants.CONTEXT_PATH}/${Constants.POLICY}`)
export class PolicyController {
  constructor(@inject(PolicyService) private policyService: PolicyService) {}

  /**
   * API to upload the attached XLSX/CSV data into MongoDB using worker threads
   * @param req files
   * @returns status
   */
  @httpPost("/uploadData", multer().any())
  async uploadData(req: Request, res: Response) {
    try {
      const filesData: any = req.files;
      await this.policyService.processCsvData(filesData[0].buffer);
      return { msg:'success' };
    } catch (err) {
      return this.policyService.handleError(err, 'uploadData');
    }
  }


  /**
   * Search API to find policy info with the help of the username.
   * @param req firstname
   * @returns policy info
  */
  @httpPost("/searchPolicy")
  async searchData(req: Request, res: Response) {
    try {
      return await this.policyService.searchWithUsername(req.body.firstname);
    } catch (err) {
      return this.policyService.handleError(err, 'getItems');
    }
  }


  /**
   * API to provide aggregated policy by each user
   * @returns policy info of each user
  */
  @httpGet("/policyOfUsers")
  async policyOfEachUser(req: Request, res: Response) {
    try {
      return await this.policyService.policyOfEachUser();
    } catch (err) {
      return this.policyService.handleError(err, 'getItems');
    }
  }
}