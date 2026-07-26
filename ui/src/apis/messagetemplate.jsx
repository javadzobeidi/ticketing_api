import {api} from "./index";

export const messageTemplate = {

    list : async () => {
    const { data } = await api.get('/messagetemplate');
    return data;
},
 create : async (model) => {
    const { data } = await api.post('/messagetemplate',model);
    return data;
},

 remove : async (id) => {
    const { data } = await api.delete(`/messagetemplate/${id}`);
    return data;
},



};





