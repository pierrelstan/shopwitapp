import axios from 'axios';
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOAD,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  NEW_PASSWORD,
  NEW_PASSWORD_FAIL,
} from './types';
// import { allCarts } from './ItemsActions';
import { setAlert } from './alert';
import setAuthToken from '../../utils/setAuthToken';

// Load user
export const loadUser = () => (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
  axios
    .get('http://localhost:4000/auth', config)
    .then((res) => {
      console.log(res);
      dispatch({
        type: USER_LOAD,
        payload: res.data,
      });
      // dispatch(allCarts());
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

// register user
export const register = ({
  firstname,
  lastname,
  email,
  password,
  confirmPassword,
  //   error,
}) => async (dispatch) => {
  const body = {
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
    // error,
  };

  try {
    axios.post('http://localhost:4000/auth/signup', body).then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    });
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login user
export const Log_in = (user) => (dispatch) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  axios.post('http://localhost:4000/auth/login', user, config).then(
    (res) => {
      console.log(res);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      return dispatch(loadUser());
    },
    (error) => {
      // error handling

      let errors = error.response.data.errors;
      console.log(errors);
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        dispatch({
          type: LOGIN_FAIL,
        });
      }
    },
  );
};

// Log out clear profile

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const newPassWord = (token, state, props) => async (dispatch) => {
  try {
    let res = await axios.post(
      `http://localhost:4000/auth/newpassword/${token}`,
      state,
    );

    dispatch({
      type: NEW_PASSWORD,
      payload: res.data,
    });

    dispatch(loadUser());
    props.history.push('/');
  } catch (error) {
    dispatch({
      type: NEW_PASSWORD_FAIL,
    });
  }
};
