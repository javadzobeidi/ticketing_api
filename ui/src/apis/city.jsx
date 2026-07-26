import {api} from "./index";

export const city = {

    list : async () => {
    const { data } = await api.get('/city');
    return data;
}

};





