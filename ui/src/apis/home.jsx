import {api} from "./index";

export const home = {

    persianDate : async () => {
    const { data } = await api.get('/home/persiandate');
    console.log("DATA is ok",data);
    
    return data;
}

};





