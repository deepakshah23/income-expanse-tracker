const express = require("express");
const {
  createAccountCtrl,
  getSingleAccountCtrl,
  getAccountsCtrl,
  deleteAccountCtrl,
  updateAccountCtrl,
} = require("../../controllers/accounts/accountsCtrl");
const isLogin = require("../../middlewares/isLogin");
const accountsRoute = express.Router();

// POST/api/v1/accounts
accountsRoute.post("/", isLogin, createAccountCtrl);

// GET/api/v1/accounts/:id
accountsRoute.get("/:id", getSingleAccountCtrl);

// GET/api/v1/accounts
accountsRoute.get("/", getAccountsCtrl);

// DELETE/api/v1/accounts/:id
accountsRoute.delete("/:id", deleteAccountCtrl);

// UPDATE/api/v1/accounts/:id
accountsRoute.put("/:id", updateAccountCtrl);

module.exports = accountsRoute;
