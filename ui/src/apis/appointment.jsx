import { api } from './index';

// Create appointment schedule
export const create = async (scheduleData) => {
  try {
    const response = await api.post('/admin/appointment', scheduleData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all appointment schedules
export const freeAppointmentList = async (branchDepartmentId,reserveDate) => {
  try {
    const response = await api.post(`/appointment/freeList`,{branchDepartmentId:branchDepartmentId,reserveDate:reserveDate});
    return response;
  } catch (error) {
    throw error;
  }
};

/////////////////////////
export const reserve = async (data) => {
  try {
    const response = await api.post(`/appointment`,data);
    return response;
  } catch (error) {
    throw error;
  }
};

////////////
export const listByUser = async (data) => {
  try {
    const response = await api.post(`/appointment/list`,data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const listByManage = async (data) => {
  try {
    const response = await api.post(`/admin/appointment/list`,data);
    return response;
  } catch (error) {
    throw error;
  }
};


export const details = async (id) => {
  try {
    const response = await api.post(`/admin/appointment/detail/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const completeAppointment = async (data) => {
  try {
    const response = await api.post(`/admin/appointment/complete`,data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const referralAppointment = async (data) => {
  try {
    const response = await api.post(`/admin/appointment/referral`,data);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getConversations = async (code) => {
  try {
    const response = await api.get(`/appointment/conversations/${code}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const cancel = async (code) => {
  try {
    const response = await api.get(`/appointment/cancel/${code}`);
    return response;
  } catch (error) {
    throw error;
  }
};



///////

export const getAppointmentSchedules = async () => {
  try {
    const response = await api.get('/appointments/schedules');
    return response;
  } catch (error) {
    throw error;
  }
};


// Get appointment schedule by ID
export const getAppointmentSchedule = async (id) => {
  try {
    const response = await api.get(`/appointments/schedules/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update appointment schedule
export const updateAppointmentSchedule = async (id, scheduleData) => {
  try {
    const response = await api.put(`/appointments/schedules/${id}`, scheduleData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete appointment schedule
export const deleteAppointmentSchedule = async (id) => {
  try {
    const response = await api.delete(`/appointments/schedules/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get available time slots for a specific date and schedule
export const getAvailableTimeSlots = async (scheduleId, date) => {
  try {
    const response = await api.get(`/appointments/schedules/${scheduleId}/slots`, {
      params: { date }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Book an appointment
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointments/book', appointmentData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user's appointments
export const getUserAppointments = async () => {
  try {
    const response = await api.get('/appointments/user');
    return response;
  } catch (error) {
    throw error;
  }
};

// Update appointment status (for managers)
export const updateAppointmentStatus = async (id, status, response = null) => {
  try {
    const response = await api.put(`/appointments/${id}/status`, {
      status,
      response
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all appointments (for managers)
export const getAllAppointments = async (filters = {}) => {
  try {
    const response = await api.get('/appointments', {
      params: filters
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Cancel appointment
export const cancelAppointment = async (id) => {
  try {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const appointment = {
  create,
  freeAppointmentList,
  reserve,
listByUser,
listByManage,
details,
completeAppointment,
referralAppointment,
getConversations,
cancel,
  getAppointmentSchedules,
  getAppointmentSchedule,
  updateAppointmentSchedule,
  deleteAppointmentSchedule,
  getAvailableTimeSlots,
  bookAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  cancelAppointment
};
