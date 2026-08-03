const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5161';

import axios from 'axios';

import { auth } from './auth';
import {ticket} from './ticket'
import {user} from './user'
import {city} from './city'
import {department} from './department'
import {branch} from './branch'
import {role} from './role'
import {appointment} from './appointment'
import {captcha} from './captcha'
import {home} from './home'
import { dashboard } from './dashboard';
import { messageTemplate } from './messagetemplate';
import { reports } from './reports';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // 1. Get the token from local storage
    const token = localStorage.getItem('ticket_token');

    // 2. If the token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);



api.interceptors.response.use(

  (response) => {
    // Assuming your server's successful response body is: { data: ..., message: ... }
    const successResponse = {
      data: response.data.data,
      message: response.data.message,
      success: response.status, 
    };
    return successResponse;
  },

 
  (error) => {
    console.log("Error is :",error)
    // Default error message if the server doesn't provide one
    let errorMessage = 'An unexpected error occurred.';

      if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('ticket_token');
      // Redirect to login page, e.g., window.location.href = '/login';
    }



    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    const errorResponse = {
      data: null,
      message: errorMessage,
      success: false,
    };
    
    console.log("Error Response:",errorResponse)
  
    return Promise.reject(errorResponse);
  }
);


export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
};


export const apiServices  = {
  auth,
  dashboard,
  user,
  city,
  department,
  branch,
  role,
  appointment,
  captcha,
  home,
  ticket,
  messageTemplate,
  reports
};
