import React, { createContext, useReducer } from "react";
import axios from "axios";
import { API_URL_TRANSACTION } from "../../../utils/apiURL";

import {
  TRANSACTION_CREATION_SUCCESS,
  TRANSACTION_CREATION_FAIL,
} from "./transactionsActionTypes";

export const transactionContext = createContext();

const INITIAL_STATE = {
  transaction: null,
  transactions: [],
  loading: false,
  error: null,
  token: JSON.parse(localStorage.getItem("userAuth")),
};
const transactionReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case TRANSACTION_CREATION_SUCCESS:
      return {
        ...state,
        loading: false,
        transaction: payload,
      };
    case TRANSACTION_CREATION_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export const TransactionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, INITIAL_STATE);

  //create account
  const createTransactionAction = async (accountData) => {
    try {
      //header
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.token?.token}`,
        },
      };
      //request
      const res = await axios.post(
        `${API_URL_TRANSACTION}`,
        accountData,
        config
      );
      console.log(accountData);
      console.log("Create tran", res);
      if (res?.data?.status === "success") {
        dispatch({
          type: TRANSACTION_CREATION_SUCCESS,
          payload: res?.data?.data,
        });
        // Redirect
        window.location.href = `/account-details/${accountData.account}`;
      }
    } catch (error) {
      dispatch({
        type: TRANSACTION_CREATION_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };
  return (
    <transactionContext.Provider
      value={{
        transaction: state.transaction,
        transactions: state.transactions,
        createTransactionAction,
        error: state?.error,
      }}
    >
      {children}
    </transactionContext.Provider>
  );
};
