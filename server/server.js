const express = require("express");
const dbConnect = require("./config/dbConnect");
const cors = require("cors");
const usersRoute = require("./routes/users/usersRoute");
const transactionsRoute = require("./routes/transactions/transactionsRoute");
const accountsRoute = require("./routes/accounts/accountsRoute");
const globalErrHandler = require("./middlewares/globalErrHandler");

const app = express();

// middlewares
app.use(express.json()); // pass incoming data
// cors middleware
app.use(cors());

// routes

// users route
app.use("/api/v1/users", usersRoute);

// account routes
app.use("/api/v1/accounts", accountsRoute);

// transaction routes
app.use("/api/v1/transactions", transactionsRoute);

// Error handlers
app.use(globalErrHandler);

// listen to server
const PORT = process.env.PORT || 9000;

const start = async () => {
  try {
    await dbConnect();
    console.log("Database Connected successfully");

    app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
  } catch (error) {
    console.error(`Server Connection Error ${error.message}`);
  }
};

start();
