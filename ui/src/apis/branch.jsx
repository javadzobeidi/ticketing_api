import {api} from "./index";

export const branch = {

      create : async (model) => {
    const { data } = await api.post('/branch',model);
    return data;
},
  get : async (id) => {
    const { data } = await api.get(`/branch/${id}`);
    return data;
},

  update : async (id,model) => {
    const { data } = await api.put(`/branch/${id}`,model);
    return data;
},
  delete : async (id) => {
    const { data } = await api.delete(`/branch/${id}`);
    return data;
},
    list : async () => {
    const { data } = await api.get('/branch');
    return data;
},
   getByCity : async (cityId) => {
    const { data } = await api.get(`/branch/city/${cityId}`);
    return data;
},

getUserDepartmentsById : async (id) => {
  const { data } = await api.get(`/branch/users/${id}`);
  return data;
},
getUserDepartmentsByCity : async (id) => {
  const { data } = await api.get(`/branch/usersByCity/${id}`);
  return data;
},

   getHierarchyByCity : async (cityId) => {
    const { data } = await api.get(`/branch/hierarchyByCity/${cityId}`);
    return data;
},

   branchdepartmentsByCity : async (cityId) => {
    const { data } = await api.get(`/branch/branchdepartmentsByCity/${cityId}`);
    return data;
},





};





