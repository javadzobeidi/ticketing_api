import {api} from "./index";

export const tradeAssociation = {
    create : async (model) => {
    const { data } = await api.post('/tradeAssociation', model);    
    return data;
},

  list : async ({ search = '', pageNumber = 1, pageSize = 10 } = {}) => {
  const params = {
    PageNumber: pageNumber,
    PageSize: pageSize,
  };
  if (search) params.filter = search;
  const { data } = await api.get('/tradeAssociation', { params });
  return data;
}


};





