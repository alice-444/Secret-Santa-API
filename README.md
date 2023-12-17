# API - Secret Santa
*Application en NodeJS* -
**Objectif** : The API should enable users to register, create groups, and secretly assign people to each group member. **Durée** : 1.5 jour
## Features to Implement :
### 1. User Registration and Authentification
- User account creation with authentification.
- Managing password security.
- Implementing JWT authentification
### 2. Creation and Management of Groups
- Allowing users to create groups.
- Inviting members via email.
- Accepting or declining invitations.
### 3. Secret Assignement of "Secret Santas"
- Algorythm to randomly assign a group member to each participant.
- Ensuring no ends up with their own name.
## Requirements
- ✔️ Git Flow or Github flow
- 〰️ Comment your code
- 💯 Complete README to initialize the project
- 💻 Code quality and clarity
- 🔒 API security
- 🚫 Good error handling and data validation
- 📄 API documentation / Postman Collection
## Optional Bonuses :
- ✅ Implement unit tests
- 🌍 Deploy the API on a server (Heroku, AWS, etc.)
- Create an interface for group administration (view members, delete groups, etc.).

# Secret Santa API #
Welcome to the Secret Santa API project! This NodeJS application allows users to register, create groups, and secretly assign "Secret Santas." Follow the instructions below to set up and use the Secret Santa API.

## Getting Started ##
### Clone the Repository ###
( https://github.com/alice-444/Secret-Santa-API.git )
`cd secret-santa-api`

### Install Dependencies ###
`npm install`

### Set Environment Variables ###
Create a .env file based on the provided .env.example.
Add your configuration details, such as the database connection string and JWT secret.

### Run the Application ###
`npm start`

### API Documentation ###
Access the API documentation to understand and test the available endpoints.

### Contribution Guidelines ###
We welcome contributions to enhance the Secret Santa API! Follow these guidelines:
- Fork the repository, create a new branch, and submit a pull request.
- Ensure code quality, add necessary comments, and update documentation.
- Write unit tests for any new features or changes.

Thank you for contributing to the Secret Santa API project! 🎅✨
