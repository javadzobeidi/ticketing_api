import { useQuery } from '@tanstack/react-query';
import { apiServices } from '@/src/apis';

// City Queries
export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: ()=>apiServices.city.list(),
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => apiServices.role.list(),
  });
};


export const useBranchHierarchyByCity = (cityId: number) => {
  
  return useQuery({
    queryKey: ['branchCity', cityId], 
    queryFn: () => apiServices.branch.getHierarchyByCity(cityId!),
    enabled: !!cityId,
  });
};



export const useBranchDepartmentsByCity = (cityId: number) => {
  
  return useQuery({
    queryKey: ['branchCity', cityId], 
    queryFn: () => apiServices.branch.branchdepartmentsByCity(cityId!),
    enabled: !!cityId,
  });
};



export const useBranchByCity = (cityId: number) => {
  
  return useQuery({
    queryKey: ['branchCity', cityId], 
    queryFn: () => apiServices.branch.getByCity(cityId!),
    enabled: !!cityId,
  });
};

export const useUserDepartmentById = (id: number) => {
  
  return useQuery({
    queryKey: ['userDepartments', id], 
    queryFn: () => apiServices.branch.getUserDepartmentsById(id!),
    enabled: !!id,
  });
};


export const useUserDepartmentByCity = (id: number) => {
  
  return useQuery({
    queryKey: ['userDepartmentsByCity', id], 
    queryFn: () => apiServices.branch.getUserDepartmentsByCity(id!),
    enabled: !!id,
  });
};



export const useUsers = (filter: string = '', pageNumber: number = 1, pageSize: number = 50) => {
  return useQuery({
    queryKey: ['users', filter, pageNumber, pageSize],
    queryFn: () => apiServices.user.list(filter, pageNumber, pageSize),
  });
};

export const useCaptchaRequest = () => {
  return useQuery({
    queryKey: ['captchaToken'],
    queryFn: ()=>apiServices.captcha.get(),
  });
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'], 
    queryFn: () => apiServices.user.me(),
    retry: false,  
  });
};




export const queries = {
    useCities,useRoles,useBranchByCity,useUsers,useCaptchaRequest,useUserInfo
  };
