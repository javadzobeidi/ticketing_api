import {api} from "./index";

export const tradeCategory = {

    create : async (model) => {
    const { data } = await api.post('/tradeAssociation', model);    
    return data;
},
 list : async () => {
    const { data } = await api.get('/tradecategory');    
    return data;
}


};





