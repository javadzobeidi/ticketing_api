import {api} from "./index";

export const role = {

    list : async () => {
    const { data } = await api.get('/admin/role');
    return data;
}

};





