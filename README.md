# Tasty
Tasty is a platform for users to share and discuss various recipes. It offers easy recipe search, ingredient cart creation for convenient shopping experiences, and considers user dietary preferences for inclusivity.

## Main Features:
- User Creation (login/signup)
- User Recipe Enlistment
- User profile management
- Recipe Search and filters
- Recipe comment and rating
- Recipe favorites
- Daily, weekly, monthly meal planning
- Shopping list creation based on meal plans
- Calorie counter
- Ingredient substitutes


## Prerequisites

- [Yarn](https://yarnpkg.com/) package manager installed
- set up 2 terminals before proceeding with the following steps for both
- first one 
    ```bash
    cd Backend
    ```
- second one 
    ```bash
    cd frontend
    ```

## Installation

1. Install dependencies using Yarn:

    ```bash
    yarn install
    ```

## Database Setup

2. Download and install [PostgreSQL](https://www.postgresql.org/download/).
3. Create a new PostgreSQL database.

## Environment Configuration

4. Set up your environment variables by creating a `.env` file in the root directory of the project. Add the following variable to the `.env` file, replacing `[port]` and `[dbName]` with your PostgreSQL port number and database name:

    ```plaintext
    DATABASE_URL=postgres://postgres:root@localhost:[port]/[dbName]
    ```

## Database Reset (Optional)

If you want to reset or create your database:

5. Navigate to `pgdb.ts` file in the `src/db` directory.
6. Edit the `sync` function as follows:

    ```typescript
    export const sync = async () => {
        sequelize.sync({ force: true });
    };
    ```

    This will force the database to sync and reset its schema.

## Running the Application

7. Once the setup is complete, start the development server using the following command:

    ```bash
    yarn dev
    ```

Following these steps will ensure that your application is set up correctly and ready to run. If you encounter any issues during setup or execution, feel free to reach out for assistance.
