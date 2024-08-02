const express = require("express");
const {
  createTransactionCtrl,
  getTransactionsCtrl,
  getSingleTransactionCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
} = require("../../controllers/transactions/transactionsCtrl");
const isLogin = require("../../middlewares/isLogin");

const transactionsRoute = express.Router();

// POST/api/v1/transactions
transactionsRoute.post("/", isLogin, createTransactionCtrl);

// GET/api/v1/transactions
transactionsRoute.get("/", getTransactionsCtrl);

// GET/api/v1/transactions/:id
transactionsRoute.get("/:id", getSingleTransactionCtrl);

// DELETE/api/v1/transactions/:id
transactionsRoute.delete("/:id", deleteTransactionCtrl);

// UPDATE/api/v1/transactions/:id
transactionsRoute.put("/:id", updateTransactionCtrl);

module.exports = transactionsRoute;
