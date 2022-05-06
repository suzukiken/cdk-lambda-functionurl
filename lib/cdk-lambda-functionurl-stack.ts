import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkLambdaFunctionurlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const json_function = new lambda.Function(this, "JsonFunc", {
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
      handler: "respond_json.handler"
    });

    const html_function = new lambda.Function(this, "HtmlFunc", {
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
      handler: "respond_html.handler"
    });
    
    const json_function_url = json_function.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, 
      cors: {
        allowedOrigins: ['*']
      }
    });
    
    const html_function_url = html_function.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, 
      cors: {
        allowedOrigins: ['*']
      }
    });
    
    new CfnOutput(this, 'JsonFuncUrl', {
      value: json_function_url.url,
    });
    
    new CfnOutput(this, 'HtmlFuncUrl', {
      value: html_function_url.url,
    });
  
  }
}