import {api} from "./index";

export const user = {
    register : async (model) => {
    const { data } = await api.post('/user',model);
    return data;
},

    update : async (id,model) => {
    const { data } = await api.put(`/admin/user/${id}`,model);
    return data;
},

 get : async (id) => {
    const { data } = await api.get(`/admin/user/${id}`);
    return data;
},

 list : async (filter = '', pageNumber = 1, pageSize = 50) => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());
    
    const { data } = await api.get(`/admin/user?${params.toString()}`);
    return data;
},

 me : async () => {
    const { data } = await api.get(`/user/me`);
    return data;
},

 logout : async () => {
    const { data } = await api.get(`/auth/logout`);
          localStorage.removeItem('ticket_token');

    return data;
},


};





