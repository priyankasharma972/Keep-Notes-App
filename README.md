# Keep Notes App
This is a Keep Notes Application hosted on AWS Serverless.
A User can create,update,delete and view all the created notes for a day to day routine.

## Functionality 

- This application allows users to create, view, update, delete notes.
- This application allows users to upload a file(for any existing notes, pictures and so on). 
- This application displays the notes only for a logged in user(User Authenticaion via Auth0).
- A user would have to authenticate in order to use an notes app.
- A user will also get the notification for all the current session and the session id is stored in the database table. This is achieved using web socket

## Codebase

- The business logic is separated from the code for database access, file storage, and code related to AWS Lambda.
- To get results of asynchronous operations, the application is using async/await constructs instead of passing callbacks.

## Best Pratices

- All resources in the application are defined in the `serverless.yml` file.
- Each function has its own set of permissions.
- Application has sufficient monitoring.
- HTTP requests are validated.

## Architecture

- Data is stored in a table with a composite key.

```
KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
```

- items are fetched using the `query()` method and not `scan()` method (which is less efficient on large datasets)


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Client

To run a client application first edit the `client/src/config.ts` file to set the correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```


## Author
Priyanka Sharma authored the Notes Application
