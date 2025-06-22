# StayFinder

StayFinder is a full-stack web application designed to facilitate property listings and bookings for short-term and long-term stays, similar to Airbnb. This project aims to provide users with a seamless experience in listing and booking properties while allowing hosts to manage their listings effectively.

## Project Structure

The project is divided into two main parts: the backend and the frontend.

### Backend

The backend is built using Node.js and Express. It provides a RESTful API for user authentication, property listings, and bookings.

- **src/app.js**: Entry point for the backend application.
- **src/controllers**: Contains business logic for different routes.
- **src/models**: Defines database schemas for Users, Listings, and Bookings.
- **src/routes**: Defines API endpoints for user authentication and listings.
- **src/middleware**: Contains middleware functions for authentication and error handling.
- **package.json**: Configuration file for npm, listing dependencies and scripts.
- **.env**: Contains environment variables for the backend.

### Frontend

The frontend is built using React and Tailwind CSS. It provides a user-friendly interface for browsing and managing property listings.

- **public/index.html**: Main HTML file serving as the entry point for the React app.
- **src/components**: Contains reusable React components.
- **src/pages**: Contains page components representing different views in the application.
- **src/App.jsx**: Main application component that sets up routing.
- **src/index.js**: Entry point for the React application.
- **src/styles/tailwind.css**: Tailwind CSS styles for the frontend.
- **package.json**: Configuration file for npm, listing dependencies and scripts.

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file and configure your environment variables (e.g., database connection strings).
4. Start the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Project Goals

- Build a functional prototype with property listing, search, and booking features.
- Implement user authentication 
- Create a user-friendly interface using React and Tailwind CSS.

## Unique Features

- Implement search filters for location, price, and date.
- Integrate a map feature using Google Maps.