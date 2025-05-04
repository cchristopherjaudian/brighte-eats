import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import LeadsDbVpc from './vpc/leads_db.vpc';
import LeadsDbRds from './rds/leads_db.rds';
import LeadsGraphqlApi from './app_sync/leads.graphql';
import {
    APP_SYNC_RESOURCE_IDS,
    GRAPHQL_DATASOURCES_ID,
} from '../ts/enums/app_sync.enums';
import { RDS_DB_NAME } from '../ts/enums/rds.enums';
import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';
export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const { leadsDbVpc } = new LeadsDbVpc(this);

        const { leadsCluster } = new LeadsDbRds(this, { leadsDbVpc });

        const { graphqlApi } = new LeadsGraphqlApi(this);

        // leadsCluster.secret?.grantRead(graphqlApi.);
        const clusterDataSource = graphqlApi.addRdsDataSource(
            GRAPHQL_DATASOURCES_ID.LEADS_CLUSTER_DATASOURCE,
            leadsCluster,
            leadsCluster.secret!,
            RDS_DB_NAME.LEADS_DB
        );

        clusterDataSource.createResolver(
            APP_SYNC_RESOURCE_IDS.GET_LEADS_RESOLVER,
            {
                typeName: 'Query',
                fieldName: 'getItem',
                requestMappingTemplate: MappingTemplate.fromString(`
              {
                "version": "2018-05-29",
                "statements": ["SELECT * FROM Items WHERE id = :id"],
                "variableMap": { ":id": $util.toJson($ctx.args.id) }
              }
            `),
                responseMappingTemplate: MappingTemplate.fromString(
                    '$utils.toJson($ctx.result[0])'
                ),
            }
        );

        clusterDataSource.createResolver(
            APP_SYNC_RESOURCE_IDS.GET_LEAD_RESOLVER,
            {
                typeName: 'Mutation',
                fieldName: 'addItem',
                requestMappingTemplate: MappingTemplate.fromString(`
              {
                "version": "2018-05-29",
                "statements": ["INSERT INTO Items(id, name, description) VALUES(UUID(), :name, :description)"],
                "variableMap": {
                  ":name": $util.toJson($ctx.args.input.name),
                  ":description": $util.toJson($ctx.args.input.description)
                }
              }
            `),
                responseMappingTemplate: MappingTemplate.fromString(
                    '$utils.toJson($ctx.result)'
                ),
            }
        );
    }
}
