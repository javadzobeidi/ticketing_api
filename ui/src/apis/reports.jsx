import {api} from "./index";

export const reports = {

    listExpertPerformance : async (params) => {
    const { data } = await api.post('/report/expertperformance',params);
    return data;
},

    listDepartmentsPerformance : async (params) => {
    const { data } = await api.post('/report/departments',params);
    return data;
}

};





