import logging
import boto3
import json

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def handler(event, context):
    logger.info(event)
    
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "text/html",
        },
        "body": '''
            <!DOCTYPE html>
            <html lang="ja">
            <head>
            <title>タイトル</title>
            </head>
            <body>
            <h1>あいさつ</h1>
            <p>
            こんにちは
            </p>
            </body>
            </html>
        '''
    }
