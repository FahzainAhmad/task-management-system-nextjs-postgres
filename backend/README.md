# Task Management Backend

## About the Project
This is a backend service for a task management system, built using modern web development technologies. The project follows the **MVC (Model-View-Controller)** architecture to ensure a clean separation of concerns, making the code maintainable and scalable.

### Key Features
- Developed with **Node.js** and **Express** for server-side logic.
- **Sequelize ORM** with **PostgreSQL** as the database for efficient data handling.
- Built using **TypeScript** to ensure type safety and reduce runtime errors.
- **JWT Authentication** for secure user sessions.
- Implements **validations** and **error handling** to ensure robust functionality.
- Supports **pagination** and **filtering** for efficient data retrieval.

---

## Technologies Used
- **Node.js**  
- **Express**  
- **Sequelize ORM**  
- **PostgreSQL**  
- **JWT Authentication**  
- **TypeScript**

---

## Project Structure
The project follows the **MVC** architecture:
- **Models**: Defines database schemas and relationships using Sequelize.
- **Views**: N/A (API-only backend, no UI rendering).
- **Controllers**: Contains logic to handle HTTP requests and responses.

---

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (Ensure `psql` CLI is available)
- [npm](https://www.npmjs.com/)

### Setup Instructions
1. **Clone the Repository**
   git clone https://github.com/your-repo/task-backend.git
   cd task-backend
   
2. **Install Dependencies**  
   Run the following command to install all required dependencies:
   npm install

3. **Configure the Environment**  
   Create an .env file in the root directory and populate it with the following variables:
   DB_NAME=tasks_db
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_secret_key

4. **Create the Database**  
   Before proceeding, ensure that the database tasks_db exists:

5. **Run Database Migrations**  
   Apply the necessary migrations to set up the database schema:
   npx sequelize-cli db:migrate

6. **Start the Server**
   Launch the development server:
   npm run dev
   
