Real-Time Chat Application

This repository contains a real-time chat application built with React (frontend), Node.js and Express (backend), and Socket.IO for real-time communication. The application is designed to allow users to register, log in, and chat instantly with others in a secure and responsive environment.

Features

User Authentication: Utilizes JWT-based authentication for secure login.

Real-Time Messaging: Socket.IO powers real-time message exchange for a seamless chat experience.

User Filtering: Filters out the logged-in user from the user list to prevent self-chat.

Chat History: Displays previous messages between users to maintain conversation context.

Responsive UI Design: A clean, user-friendly interface with the user list on the left and the chat on the right.

Logout Functionality: Includes a logout option to securely log the user out and return to the login page.


Technologies Used

Frontend: React, Tailwind CSS

Backend: Node.js, Express.js, MongoDB

Real-Time Communication: Socket.IO

Authentication: JSON Web Tokens (JWT)


Getting Started

Prerequisites

To run this project locally, ensure you have the following installed:

Node.js

MongoDB

Git


Installation

1. Clone the repository:

2. Install dependencies for both frontend and backend:

Navigate to the backend directory:

cd server
npm install

Navigate to the frontend directory:

cd ../client
npm install



3. Environment Variables: Create a .env file in the backend directory (server) and add the following:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000


4. Run the application:

Start the backend server:

cd ../server
npm start

Start the frontend server:

cd ../client
npm start



5. Access the application:

Open a browser and navigate to http://localhost:3000




Usage

1. Register a new account or log in with existing credentials.


2. Browse the list of users and select one to start a chat.


3. Send and receive messages in real-time.


4. Log out when finished to end the session.



Folder Structure

client: React frontend of the chat application.

server: Node.js backend with routes for authentication and message handling.
