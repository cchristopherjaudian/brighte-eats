import {
    GraphqlApi,
    SchemaFile,
    AuthorizationType,
    CfnGraphQLApi,
} from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs';
import { APP_SYNC_RESOURCE_IDS } from '../../ts/enums/app_sync.enums';

export default class LeadsGraphqlApi {
    public readonly graphqlApi: GraphqlApi;

    constructor(scope: Construct) {
        this.graphqlApi = new GraphqlApi(
            scope,
            APP_SYNC_RESOURCE_IDS.LEADS_GRAPHQL_API,
            {
                name: 'cdk-api-rds',
                schema: SchemaFile.fromAsset('graphql/schema.graphql'),
                authorizationConfig: {
                    defaultAuthorization: {
                        authorizationType: AuthorizationType.API_KEY,
                    },
                },
                // xrayEnabled: true,
            }
        );

        (this.graphqlApi.node.defaultChild as CfnGraphQLApi).overrideLogicalId(
            APP_SYNC_RESOURCE_IDS.LEADS_GRAPHQL_API
        );
    }
}
