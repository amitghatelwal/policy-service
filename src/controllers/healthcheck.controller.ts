import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { PolicyService } from "../services/policy.service";
import { inject } from "inversify";
import { Constants } from "../utils/Constants";

@controller(`${Constants.CONTEXT_PATH}/${Constants.HEALTH_CHECK}`)
export class HealthController {
  constructor(@inject(PolicyService) private policyService: PolicyService) {}

  @httpGet("/")
  async getHealthCheck(req: Request, res: Response) {
    try {
      await this.policyService.getItems({limit: 1});
      return res.json({msg: 'success'});
    } catch (err) {
      return this.policyService.handleError(err, 'getHealthCheck');
    }
  }
}

