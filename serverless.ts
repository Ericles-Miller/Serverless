import type { AWS } from '@serverless/typescript';

// import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { 
    hello: {
      handler: "src/functions/hello.handler",
      events: [
        {
          http: {
            path: "hello",
            method: "get",
            cors: true
          }
        }
      ]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },

  resources: {
    Resources: {
      dbCertificateUsers: {
        Type: "AWS::Dynamo::DBTable",
        Properties: {
          TableName: "usersCertificate",
          ProvisionedThroughput: {
            ReadCapacityUnits:5,
            WriteCapacityUnits:5,
          },
          AttributesDefinitions:[
            {
              AttributesName: "id",
              AttributesType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              keyType: "HASH",
            },
          ],
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
