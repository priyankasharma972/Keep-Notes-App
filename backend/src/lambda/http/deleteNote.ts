import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteNote } from '../../businessLayer/notes'
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    if (!(await deleteNote(event))) {
        logger.info("Note cannot be seen")
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Note does not exist'
        })
      };
    }
  
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    };
  }
