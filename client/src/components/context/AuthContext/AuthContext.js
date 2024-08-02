import { createContext, useReducer } from "react";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  FETCH_PROFILE_FAIL,
  FETCH_PROFILE_SUCCESS,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "./authActionTypes";
import axios from "axios";
import { API_URL_USER } from "../../../utils/apiURL";
// auth context
export const authContext = createContext();

// Initial state
const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem("userAuth")),
  error: null,
  loading: false,
  profile: null,
};

// Auth Reducer

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        userAuth: payload,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
        userAuth: null,
      };
    case LOGIN_SUCCESS:
      // Add user to localstorage
      localStorage.setItem("userAuth", JSON.stringify(payload));
      return {
        ...state,
        loading: false,
        error: null,
        userAuth: payload,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        error: payload,
        loading: false,
        userAuth: null,
      };
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        profile: payload,
      };
    case FETCH_PROFILE_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
      };
    // logout
    case LOGOUT:
      // remove from storage
      localStorage.removeItem("userAuth");
      return {
        ...state,
        userAuth: payload,
        error: null,
        loading: false,
        profile: null,
      };
    default:
      return state;
  }
};

// Provider
const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  console.log(state);

  // login action
  const loginUserAction = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(`${API_URL_USER}/login`, formData, config);
      if (res?.data?.status === "success") {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
        // Redirect
        window.location.href = "/dashboard";
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAILED,
        payload: error?.response?.data?.message,
      });
    }
  };

  // profile action
  const fetchProfileAction = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state?.userAuth?.token}`,
      },
    };
    try {
      const res = await axios.get(`${API_URL_USER}/profile`, config);
      if (res?.data) {
        dispatch({
          type: FETCH_PROFILE_SUCCESS,
          payload: res.data,
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_PROFILE_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  // logout
  const logoutUserAction = () => {
    dispatch({
      type: LOGOUT,
      payload: null,
    });
    // Redirect
    window.location.href = "/login";
  };

  // Register action
  const registerUserAction = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        `${API_URL_USER}/register`,
        formData,
        config
      );
      if (res.data?.status === "success") {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
        // Redirect
        window.location.href = "/login";
      }
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  return (
    <authContext.Provider
      value={{
        loginUserAction,
        logoutUserAction,
        userAuth: state,
        fetchProfileAction,
        profile: state?.profile,
        error: state?.error,
        registerUserAction,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
