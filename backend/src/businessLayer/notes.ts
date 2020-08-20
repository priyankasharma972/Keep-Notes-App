import 'source-map-support/register';
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import NotesAccess from '../dataLayer/notesAccess';
import NotesStorage from '../dataLayer/notesStorage';
import { getUserId } from '../lambda/utils';
import { CreateNoteRequest} from '../requests/CreateNoteRequest';
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest';
import { NoteItem } from '../models/NotesItem';

const notesAccess = new NotesAccess();
const notesStorage = new NotesStorage();

export async function createNote(event: APIGatewayProxyEvent,
                                 createNoteRequest: CreateNoteRequest): Promise<NoteItem> {
    const noteId = uuid.v4();
    const userId = getUserId(event);
    const createdAt = new Date(Date.now()).toISOString();

    const noteItem = {
        userId,
        noteId,
        createdAt,
        done: false,
        attachmentUrl: `https://${notesStorage.getBucketName()}.s3.amazonaws.com/${noteId}`,
        ...createNoteRequest
    };

    await notesAccess.createNote(noteItem);

    return noteItem;
}

export async function deleteNote(event: APIGatewayProxyEvent) {
    const noteId = event.pathParameters.noteId;
    const userId = getUserId(event);

    if (!(await notesAccess.getNoteById(noteId, userId))) {
        return false;
    }

    await notesAccess.deleteNoteById(noteId, userId);

    return true;
}

export async function getNote(event: APIGatewayProxyEvent) {
    const noteId = event.pathParameters.noteId;
    const userId = getUserId(event);

    return await notesAccess.getNoteById(noteId, userId);
}

export async function getNotes(event: APIGatewayProxyEvent) {
    const userId = getUserId(event);

    return await notesAccess.getNotes(userId);
}

export async function updateNote(event: APIGatewayProxyEvent,
                                 updateNoteRequest: UpdateNoteRequest) {
    const noteId = event.pathParameters.noteId;
    const userId = getUserId(event);

    if (!(await notesAccess.getNoteById(noteId, userId))) {
        return false;
    }

    await notesAccess.updateNoteById(noteId, userId, updateNoteRequest);

    return true;
}