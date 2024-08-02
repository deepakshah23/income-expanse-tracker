const Account = require("../../model/Account");
const Transaction = require("../../model/Transaction");
const User = require("../../model/User");
const AppErr = require("../../utils/AppErr");

// Create Transaction
const createTransactionCtrl = async (req, res, next) => {
  const { name, amount, notes, transactionType, account, category } = req.body;
  try {
    // 1. Find user
    const userFound = await User.findById(req.user);
    if (!userFound) {
      return next(new AppErr("User not found", 404));
    }
    // 2. Find the account
    const accountFound = await Account.findById(account);
    if (!accountFound) {
      return next(new AppErr("Account not found", 404));
    }
    // 3. Create the transaction
    const transaction = await Transaction.create({
      amount,
      notes,
      account,
      transactionType,
      category,
      name,
      createdBy: req.user,
    });
    // 4. Push the transaction to the account
    accountFound.transactions.push(transaction._id);
    // 5. Resave the account
    await accountFound.save();
    res.json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    res.json(error);
  }
};

// Get ALL Transactions
const getTransactionsCtrl = async (req, res, next) => {
  try {
    const trans = await Transaction.find();
    res.status(200).json({
      status: "success",
      data: trans,
    });
  } catch (error) {
    next(new AppErr(error, 500));
  }
};

// Get single Transaction
const getSingleTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tran = await Transaction.findById(id);
    res.json({
      status: "success",
      data: tran,
    });
  } catch (error) {
    next(new AppErr(error, 500));
  }
};

// Delete
const deleteTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppErr(error, 500));
  }
};

// Update
const updateTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tran = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      status: "success",
      data: tran,
    });
  } catch (error) {
    next(new AppErr(error, 500));
  }
};

module.exports = {
  createTransactionCtrl,
  getTransactionsCtrl,
  getSingleTransactionCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
};
