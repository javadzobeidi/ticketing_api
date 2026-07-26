
import {api} from "./index";

 const create = async (formData) => {
  try {
    const response = await api.post('/ticket', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response;
  } catch (error) {
     throw error;
  }
};

export const listByManage = async (data) => {
  try {
    const response = await api.post(`/admin/ticket/list`,data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const listbyUser = async (data) => {
  try {
    const response = await api.post(`/ticket/list`,data);
    return response;
  } catch (error) {
    throw error;
  }
};


export const details = async (id) => {
  try {
    const response = await api.post(`/admin/ticket/detail/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const detailsByUser = async (id) => {
  try {
    const response = await api.post(`/ticket/detail/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};



 const adminSendMessage = async (formData) => {
  try {
    const response = await api.post('/admin/ticket/sendMessage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response;
  } catch (error) {
     throw error;
  }
};

 const sendMessage = async (formData) => {
  try {
    const response = await api.post('/ticket/sendMessage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response;
  } catch (error) {
     throw error;
  }
};

export const referral = async (data) => {
  try {
    const response = await api.post(`/admin/ticket/referral`,data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const close = async (data) => {
  try {
    const response = await api.post(`/ticket/close`,data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const dial = async (id) => {
  try {
    const response = await api.get(`/admin/ticket/dial/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await api.get(`/ticket/remove/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};



export const ticket = {
  create,
  listByManage,
  details,
  adminSendMessage,
  listbyUser,
  sendMessage,
  referral,
  detailsByUser,
  close,
  dial,
  remove
}
