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
            "Content-Type": "application/json",
        },
        "body": json.dumps(
            [
                {
                    'id': 40481286914256,
                    'quantity': 2
                },
                {
                    'id': 42120466956496,
                    'quantity': 3
                }
            ]
        )
    }

# 6837407678672
# gid://shopify/ProductVariant/40481286914256
# 7346082644176
# gid://shopify/ProductVariant/42120466956496