# Sneakerz Overview

Project to provide users the ability to view current properties on the market and allow users to add their property to the current list.

# Running the Application

## APP

```bash
$ git clone https://github.com/Bruneljohnson/PropertyApp.git
$ npm install
```
## Frontend

Please read the frontend README file [HERE](https://github.com/Bruneljohnson/PropertyApp/blob/main/packages/frontend-tsreact/README.md)

### Frontend Quickstart

```bash
$ cd packages
$ cd frontend-tsreact
$ npm install
$ npx dotenv-vault login
$ npx dotenv-vault pull
$ npm start
```

## Backend

Please read the Backend README file [HERE](https://github.com/Bruneljohnson/PropertyApp/blob/main/packages/backend-node/README.md)

### Backend Quickstart

```bash
$ cd packages
$ cd backend-node
$ npm install
$ npx dotenv-vault login
$ npx dotenv-vault pull
$ npm start
```

The front-end and back-end needs to run simultaneously in order for the app to successfully run locally.

You will also need the environment variables.

# APP Preview

Media Queries set from 425px upwards.

![The PropertyApp ](./packages/backend-node/docs/PropertyApp.png)
# Next Steps

From this example, the next steps would be the following:

- Implement Production flow
- Add type of property to schema
- Implement a user account where people can see their; currents listings, progress updates, notifications, and todo list
- Allow multiple images per listing
- Implement authentication and privacy, GDPR and data handling policies.
- Accounts can be updated or deleted if needed.
- allow users to update or delete a listing.
- allow users to search for properties within a specific radius
- Implement a secure payment option.
- Change to mongoose
