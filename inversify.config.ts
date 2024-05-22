import { Container } from "inversify";
import { PolicyController } from "./src/controllers/policy.controller";
import { HealthController } from "./src/controllers/healthcheck.controller";
import { PolicyService } from "./src/services/policy.service";

const container = new Container();
container.bind<HealthController>(HealthController).toSelf();
container.bind<PolicyController>(PolicyController).toSelf();
container.bind<PolicyService>(PolicyService).toSelf();

export default container;