import {api} from "./index";

export const auth = {

    login : async (model ) => {
    const { data } = await api.post('/auth/login', model);
      localStorage.setItem('ticket_token', data.token);

    return data;
},

    sendOtp : async (model ) => {
    const { data } = await api.post('/auth/sendotp', model);
    
    return data;
},

    sendOtpChangePassword : async (model ) => {
    const { data } = await api.post('/auth/sendotp_changepassword', model);
    
    return data;
},




   verifyOtp : async (model ) => {
    const { data } = await api.post('/auth/verifyotp', model);
          localStorage.setItem('ticket_token', data.token);

    return data;
},


   verifyChangePassword : async (model ) => {
    const { data } = await api.post('/auth/verify_changepassword', model);
    
    return data;
},


};





