import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const XAWS = AWSXRay.captureAWS(AWS);

export default class TodosAccess{
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly notesTable = process.env.NOTES_TABLE,
        private readonly userIdIndex = process.env.INDEX_NAME
    ){

    }

    async getNotes(userId){
        const result = await this.docClient.query({
            TableName: this.notesTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
  
        return result.Items;
    }

    async createNote(noteItem) {
        await this.docClient.put({
            TableName: this.notesTable,
            Item: noteItem
        }).promise();
    }


    async getNoteById(noteId, userId){
        const result = await this.docClient.get({
            TableName: this.notesTable,
            Key: {
                noteId,
                userId
            }
        }).promise();
  
        return result.Item;
    }

    async updateNoteById(noteId, userId, updatedNote){
        await this.docClient.update({
            TableName: this.notesTable,
            Key: {
                noteId,
                userId
            },
            UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
            ExpressionAttributeValues: {
                ':n': updatedNote.name,
                ':due': updatedNote.dueDate,
                ':d': updatedNote.done
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            }
        }).promise();
    }
  
    async deleteNoteById(noteId, userId){
        await this.docClient.delete({
            TableName: this.notesTable,
            Key: {
                noteId,
                userId
            }
        }).promise();
    
}
}