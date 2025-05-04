import { CfnVPC, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { VPC_RESOURCE_IDS } from '../../ts/enums/vpc.enums';

export default class LeadsDbVpc {
    public readonly leadsDbVpc: Vpc;

    constructor(scope: Construct) {
        this.leadsDbVpc = new Vpc(scope, VPC_RESOURCE_IDS.LEADS_DB_VPC, {
            maxAzs: 2,
        });

        (this.leadsDbVpc.node.defaultChild as CfnVPC).overrideLogicalId(
            VPC_RESOURCE_IDS.LEADS_DB_VPC
        );
    }
}
