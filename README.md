# task-manager-app
Performing REST API Operations like GET/POST/PATCH/DELETE to play around with the data in MongoDb Database(by performing CRUD Operations) using Nodejs, Express FrameWork.

### src Directory layout
    .
    ├── db
    ├── emails
    ├── middleware
    ├── models
    ├── routers
    ├── index.js

### Operations or Features:
- ADD/UPDATE/DELETE for tasks and user account
- UPLOAD a profile pic and UPDATE other user details  using "multer"       (npm module)
- Password security by hashing                        using "bycrypt"      (npm module)
- Sending Emails                                      using "nodemailer"   (npm module)
- Token generation for user friendly login            using "Jsonwebtoken" (npm module)

### npm modules used:
- "bycrypt" to encrypt and decrypt user password
- "nodemailer" to sendEmails
- "jsonwebtoken" to generate a token for each login
- "mongodb" and "mongoose" for database
- "multer" for customizing the profile pic features
- Last but not least :) "express" module for routing and http requests


## POSTMAN API is used for implementing and Testing this project
> You can checkout my postman Documentation of the same at the url: In process...  :)
