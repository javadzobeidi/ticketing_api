import {api} from "./index";

export const captcha = {

    get : async () => {
    
    const { data } = await api.get('/captcha');

    console.log("Get Captcha Tokenb:",data)
    return data;
}

};





