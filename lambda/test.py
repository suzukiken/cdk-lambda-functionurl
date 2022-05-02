import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def handler(event, context):
    logger.info(event)
    
    return 'hello'