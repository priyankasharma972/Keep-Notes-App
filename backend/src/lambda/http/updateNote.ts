import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { UpdateNoteRequest } from '../../requests/UpdateNoteRequest'
import { updateNote } from '../../businessLayer/notes';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedTodo: UpdateNoteRequest = JSON.parse(event.body);
  const logger = createLogger('auth')
  const updated = await updateNote(event, updatedTodo);
  logger.info("updating an existing note item")
  if (!updated) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Note does not exist'
      })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}