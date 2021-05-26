# task-manager-app
Performing REST API Operations like GET/POST/PATCH/DELETE to play around with the data in MongoDb Database(by performing CRUD Operations) using Nodejs, Express FrameWork.

## Operations or Features:
- ADD/UPDATE/DELETE for tasks and user account
- UPLOAD a profile pic and UPDATE other user details  using "multer"       (npm module)
- Password security by hashing                        using "bycrypt"      (npm module)
- Sending Emails                                      using "nodemailer"   (npm module)
- Token generation for user friendly login            using "Jsonwebtoken" (npm module)

## src Directory layout
    .
    ├── db
    ├── emails
    ├── middleware
    ├── models
    ├── routers
    ├── index.js

## General notes For better understanding
> NoSql Database models for 'User' and 'Task' are cereted in 'models directory' with a Relation-"if a user is removed then all tasks associated with that user must also be removed"

> mongoose-npm module is used to connect to the MongoDb database in the 'db directory'

> To route each request from a user Two routers are created ( One for Task and the other for User ) in the 'routers directory'. This is where each request is received and respective action is perfromed for all the CRUD operations on the MongoDb database

> server is initialized to listen user requests in the 'index.js file'

## npm modules used in this project:
- "bycrypt" to encrypt and decrypt user password
- "nodemailer" to sendEmails
- "jsonwebtoken" to generate a token for each login
- "mongodb" and "mongoose" for database
- "multer" for customizing the profile pic features
- Last but not least :) "express" module for routing and http requests

## POSTMAN API is used for implementing and Testing this project. (Implementation of this project is deployed published in postman)
> You can checkout my postman Documentation for more details regarding the implementation of the HTTP-Requests at the url: In process...  :)
