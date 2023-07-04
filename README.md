# Kalejdoskop Api

This project is an Express application designed to serve as the API for the Kalejdokskop project. It handles all the backend logic and routes for the project.

## Getting Started

These instructions will guide you through the process of setting up the api on your local machine for development and testing purposes.

### Prerequisites

Before you can run this project, you will need to have Node.js and npm installed on your computer. You can download Node.js from [here](https://nodejs.org/) and npm is included in the installation.

You can check if Node.js and npm are installed correctly by running the following commands in your terminal:

```sh
node --version
npm --version
```

If both commands return a version number, then the installation was successful.

### Installation

1. **Clone the repository**

   Start by cloning the repository to your local machine. You can do this by running the following command in your terminal:

   ```sh
   git clone https://github.com/sverok-man-collaboration/kalejdoskop-api.git
   ```

2. **Install dependencies**

   Navigate into the cloned repository directory and run the following command to install all necessary dependencies:

   ```sh
   npm install
   ```

   This will also install Prisma, a next-generation ORM for Node.js and TypeScript.

3. **Configure environment variables**

   You will need to create a `.env` file in the root of the project. You can use the provided `.env.example` file as a template. Simply copy the `.env.example` file and rename the copy to `.env`. Then fill in the required information.

   The Project key and API key both need to be a random 256-bit key converted into a string of 64 heaxadecimal characters.

4. **Setup Database**

   This project uses SQLite as its database. If you don't have a SQLite database, you can create one by running the following command inside the repository directory:

   ```sh
   npx prisma migrate dev --name init
   ```

### Running the project

Once you have completed the installation, you can now run the application in a development server using:

```sh
npm run dev
```

## Building the project

To compile the application for a production environment, you can run:

```sh
npm run build
```

This command will create a `dist` directory containing all the compiled JavaScript files.

## Execution

To execute the compiled application, you can run:

```sh
npm run start
```

This will start the Express server using the compiled files.

## Endpoints

The API provides the following endpoints:

- POST `/login/auth`: Authenticates a user by email.
  ```json
  {
    "body": {
      "email": "email"
    }
  }
  ```
- GET `/users`: Retrieves all users and a new token.
  ```json
  {
    "headers": {
      "Authorization": "Bearer token"
    }
  }
  ```
- POST `/users`: Creates a new user and retrieves a new token.
  ```json
  {
    "body": {
      "email": "email",
      "name": "name"
    }
  }
  ```
  ```json
  {
    "headers": {
      "Authorization": "Bearer token"
    }
  }
  ```
- DELETE `/users/:id`: Deletes a user by their ID and retrieves a new token.
  ```json
  {
    "headers": {
      "Authorization": "Bearer token"
    }
  }
  ```
- GET `/messages`: Retrieves all messages and a new token.
  ```json
  {
    "headers": {
      "Authorization": "Bearer token"
    }
  }
  ```
- GET `/three-random/:room/:object`: Retrieves three random messages for a specific room and object.
- POST `/messages`: Creates a new message.
  ```json
  {
    "body": {
      "room": "character",
      "object": "object",
      "message": "message"
    }
  }
  ```
- PATCH `/messages`: Updates a message and retrieves a new token.
  ```json
  {
    "body": {
      "id": "number",
      "status": "status",
      "message": "message || empty"
    }
  }
  ```
  ```json
  {
    "headers": {
      "Authorization": "Bearer token"
    }
  }
  ```
- GET `/statistics`: Retrieves all game related statistics.
- POST `/statistics`: Creates a new statistic.
  ```json
  {
    "body": {
      "answerId": "number"
    }
  }
  ```
  ```json
  {
    "headers": {
      "X-API-KEY": "API_KEY"
    }
  }
  ```
- GET `/statistics/downloads`: Retrieves statistics for all game downloading attempts.
- POST `/statistics/downloads`: Creates a new game downloading attempt statistic.

## Error logs

A server error log file is created in the root directory when the first server error log is encountered.
