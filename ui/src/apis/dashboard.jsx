import {api} from "./index";

export const dashboard = {

    user : async (model ) => {
    const { data } = await api.get('/dashboard/user');
    
    return data;
}

};





