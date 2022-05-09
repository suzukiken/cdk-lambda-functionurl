import { Stack, StackProps, CfnOutput, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export class CdkLambdaFunctionurlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const domain = this.node.tryGetContext('domain')
    
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
    
    
    const acmarn = Fn.importValue(this.node.tryGetContext('useast1_acmarn_exportname'))
    const certificate = acm.Certificate.fromCertificateArn(this, 'certificate', acmarn)
    
    const distribution = new cloudfront.Distribution(this, 'distribution', {
      defaultBehavior: { 
        origin: new origins.HttpOrigin(Fn.parseDomainName(html_function_url.url), {
          httpPort: 443,
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY
        }),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
      domainNames: [Fn.join(".", ['samplehtml', domain])],
      certificate: certificate
    })
    
    const zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName: domain,
    })
    
    const record = new route53.ARecord(this, "record", {
      recordName: 'samplehtml',
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone: zone,
    })
    
    new CfnOutput(this, 'JsonFuncUrl', {
      value: json_function_url.url,
    });
    
    new CfnOutput(this, 'HtmlFuncUrl', {
      value: html_function_url.url,
    });
  
  }
}