import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkLambdaFunctionurlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const test_function = new lambda.Function(this, "TestFunc", {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset("lambda", {
        bundling: {
          image: lambda.Runtime.PYTHON_3_8.bundlingImage,
          command: [
            "bash",
            "-c",
            `pip install -r requirements.txt -t /asset-output && cp -au . /asset-output`,
          ],
        },
      }),
      handler: "test.handler"
    });
    
    const function_url = test_function.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, 
      cors: {
        allowedOrigins: ['*']
      }
    });
    
    new CfnOutput(this, 'TestFuncUrl', {
      value: function_url.url,
    });
    
  }
}