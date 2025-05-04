import {
    DatabaseClusterEngine,
    ServerlessCluster,
    CfnDBCluster,
} from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { RDS_RESOURCE_IDS } from '../../ts/enums/rds.enums';
import { TLeadsDbRdsParams } from '../../ts/types/rds.types';
import { Duration } from 'aws-cdk-lib';

export default class LeadsDbRds {
    public readonly leadsCluster: ServerlessCluster;

    constructor(scope: Construct, props: TLeadsDbRdsParams) {
        this.leadsCluster = new ServerlessCluster(
            scope,
            RDS_RESOURCE_IDS.LEADS_DB_RDS,
            {
                engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
                vpc: props.leadsDbVpc,
                defaultDatabaseName: 'leads_db',
                scaling: { autoPause: Duration.minutes(10) },
            }
        );

        (this.leadsCluster.node.defaultChild as CfnDBCluster).overrideLogicalId(
            RDS_RESOURCE_IDS.LEADS_DB_RDS
        );
    }
}
