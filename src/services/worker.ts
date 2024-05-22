
import { parentPort, workerData } from 'worker_threads';
import { v4 as uuidv4 } from 'uuid';
const parentPortVar: any = parentPort;


async function processPolicyData(policyData: any): Promise<any> {
  const arrOfAgents: Array<any> = [];
  const arrOfLobCategory: Array<any> = [];
  const arrOfCompany: Array<any> = [];
  const arrOfUsers: Array<any> = [];
  const arrOfPolicies: Array<any> = [];
  let categoryNameIdMap: any = {'test': 1};
  let companyNameIdMap: any = {'test': 1};
  

  for (const dataObj of policyData) {
    if (arrOfAgents.findIndex((item: any) => item.agentName == dataObj.agent) == -1) {
      arrOfAgents.push({agentName: dataObj.agent});
    }

    if (arrOfLobCategory.findIndex((item: any) => item.category_name == dataObj.category_name) == -1) {
      const categoryId = uuidv4();
      categoryNameIdMap[dataObj.category_name] = categoryId;
      arrOfLobCategory.push({category_name: dataObj.category_name, policyCategoryId: categoryId});
    }

    if (arrOfCompany.findIndex((item: any) => item.company_name == dataObj.company_name) == -1) {
      const companyId = uuidv4();
      companyNameIdMap[dataObj.company_name] = companyId;
      arrOfCompany.push({company_name: dataObj.company_name, companyId});
    }

    const userId= uuidv4();
    const userData = {
        firstname: dataObj.firstname,
        dob: dataObj.dob,
        address: dataObj.address,
        phone: dataObj.phone,
        state: dataObj.state,
        zip: dataObj.zip,
        email: dataObj.email,
        gender: dataObj.gender,
        userType: dataObj.userType,
        userId
    }
    arrOfUsers.push(userData);

    const dataForPolicy = {
      policy_number: dataObj.policy_number,
      policy_start_date: dataObj.policy_start_date,
      policy_end_date: dataObj.policy_end_date,
      policyCategoryId: categoryNameIdMap[dataObj.category_name],
      companyId: companyNameIdMap[dataObj.company_name],
      userId
    }

    arrOfPolicies.push(dataForPolicy);
  }

  console.log(`length of arrays -`, arrOfAgents.length, arrOfLobCategory.length, arrOfCompany.length, arrOfUsers.length,arrOfPolicies.length);
  return {
    arrOfAgents,
    arrOfLobCategory,
    arrOfCompany,
    arrOfUsers,
    arrOfPolicies
  };
}


processPolicyData(workerData.value).then((data) => {
  parentPortVar.postMessage(data);
});

