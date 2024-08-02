import { createContext, useReducer } from "react";
import {
  ACCOUNT_DETAILS_SUCCESS,
  ACCOUNT_DETAILS_FAIL,
  ACCOUNT_CREATION_SUCCESS,
  ACCOUNT_CREATION_FAIL,
} from "./accountActionTypes";
import { API_URL_ACCOUNT } from "../../../utils/apiURL";
import axios from "axios";

import { useContext } from "react";
import { authContext } from "../AuthContext/AuthContext";

export const accountContext = createContext();

// Initial State
const INITIAL_STATE = {
  account: null,
  accounts: [],
  loading: false,
  error: null,
};

// reducer
const accountReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    // Details
    case ACCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        account: payload,
        loading: false,
        error: null,
      };
    case ACCOUNT_DETAILS_FAIL:
      return {
        ...state,
        account: null,
        loading: false,
        error: payload,
      };
    // Create
    case ACCOUNT_CREATION_SUCCESS:
      return {
        ...state,
        account: payload,
        loading: false,
        error: null,
      };
    case ACCOUNT_CREATION_FAIL:
      return {
        ...state,
        account: null,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

// Provider

export const AccountContextProvider = ({ children }) => {
  const { userAuth } = useContext(authContext);

  const [state, dispatch] = useReducer(accountReducer, INITIAL_STATE);
  // Get Account Details Action
  const getAccountDetailsAction = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userAuth?.userAuth?.token}`,
      },
    };
    try {
      const res = await axios.get(`${API_URL_ACCOUNT}/${id}`, config);
      if (res?.data?.status === "success") {
        // dispatch
        dispatch({
          type: ACCOUNT_DETAILS_SUCCESS,
          payload: res?.data?.data,
        });
      }
      console.log(res);
    } catch (error) {
      dispatch({
        type: ACCOUNT_DETAILS_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  // Create Account  Action
  const createAccountAction = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userAuth?.userAuth?.token}`,
      },
    };
    try {
      console.log("Formdata", formData);
      const res = await axios.post(`${API_URL_ACCOUNT}`, formData, config);
      if (res?.data?.status === "success") {
        // dispatch
        dispatch({
          type: ACCOUNT_CREATION_SUCCESS,
          payload: res?.data?.data,
        });
        // Redirect
        window.location.href = "/dashboard";
      }
    } catch (error) {
      dispatch({
        type: ACCOUNT_CREATION_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };
  return (
    <accountContext.Provider
      value={{
        getAccountDetailsAction,
        account: state?.account,
        createAccountAction,
        error: state?.error,
      }}
    >
      {children}
    </accountContext.Provider>
  );
};
