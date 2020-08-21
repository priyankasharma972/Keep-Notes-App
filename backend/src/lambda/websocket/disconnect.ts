import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)


const docClient = new XAWS.DynamoDB.DocumentClient()
const logger = createLogger('auth')
const connectionsTable = process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Websocket disconnect', event)

  const connectionId = event.requestContext.connectionId
  const key = {
      id: connectionId
  }

  logger.info('Removing item with key: ', key)

  await docClient.delete({
    TableName: connectionsTable,
    Key: key
  }).promise()

  return {
    statusCode: 200,
    body: ''
  }
}