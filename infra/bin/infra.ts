#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';
import { STACK_RESOURCE_IDS } from '../ts/enums/stack.enums';

const app = new cdk.App();

const stage = app.node.tryGetContext('stage');
const stackName = app.node.tryGetContext('stackName');

new InfraStack(app, STACK_RESOURCE_IDS.INFRA_STACK, {
    stackName: `${stage}-${stackName}`,
});

app.synth();
