import type { Vpc } from 'aws-cdk-lib/aws-ec2';

export type TLeadsDbRdsParams = {
    leadsDbVpc: Vpc;
};
