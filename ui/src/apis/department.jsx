import {api} from "./index";

export const department = {

      create : async (model) => {
    const { data } = await api.post('/department',model);
    return data;
},
  get : async (id) => {
    const { data } = await api.get(`/department/${id}`);
    return data;
},

  update : async (id,model) => {
    const { data } = await api.put(`/department/${id}`,model);
    return data;
},
  delete : async (id) => {
    const { data } = await api.delete(`/department/${id}`);
    return data;
},
    list : async () => {
    const { data } = await api.get('/department');
    return data;
},
listByHierarchy : async () => {
    const { data } = await api.get('/department/FullHierarchy');
    return data;
}


};





