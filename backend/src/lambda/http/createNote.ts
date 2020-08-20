import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { CreateNoteRequest } from '../../requests/CreateNoteRequest'
import { createNote } from '../../businessLayer/notes'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newItem: CreateNoteRequest = JSON.parse(event.body);

  const logger = createLogger('auth')
  const todoItem = await createNote(event, newItem);
  logger.info('Creating a New Note')
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: todoItem
    })
  };

}
