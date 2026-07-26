import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { apiServices } from '@/src/apis';
import { updateUserSchema, UpdateUserFormData } from './update_userschema';
import { useBranchByCity, useBranchDepartmentsByCity, useBranchHierarchyByCity, useCities, useRoles } from '@/src/lib/useQueries';
import { useUserProfile } from './useCommand';
import { useParams } from 'react-router-dom';
import UserProfile from './profile';
import { useState } from 'react';
import {  Loader2 } from "lucide-react"


const UserPage = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const [selectedCity, setSelectedCity] = useState<number | null>(null);


    const userId = params.userId ? Number(params.userId) : null;  // convert string to number
    const { register, watch, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            isActive: true,
        }
    });

    const { data: cities, isLoading: citiesLoading } = useCities();
    const { data: roles, isLoading: rolesLoading } = useRoles();

     const { data: branchHierarchy, isLoading: branchesHierarchyLoading } = useBranchHierarchyByCity(
    selectedCity ? parseInt(selectedCity) : null
  )



    const { data: userProfile, isLoading: userProfileLoading,
        error: userProfileError,
        isError

    } = useUserProfile(userId);


    const updateMutation = useMutation({
        mutationFn: (model: UpdateUserFormData) => apiServices.user.update(model!.id, model),
        onSuccess: () => {
        },
    });


    const onSubmit = (data: BranchFormValues) => {

    }


    return (
        <div dir="rtl" className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>ویرایش اطلاعات کاربر</CardTitle>
                </CardHeader>
                <CardContent>

                    {userProfileLoading ? (
                        <div className="flex items-center justify-center p-12">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
							<span className="mr-2 text-muted-foreground">در حال بارگذاری...</span>
						</div>

                    ) : isError ? (
                        <div className="bg-red-500/50 rounded-lg py-2 px-4 flex items-center">خطا در دریافت اطلاعات: {String(userProfileError.message)}</div>
                    ) : (
                        <UserProfile
                            profile={userProfile}
                            cities={cities}
                            roles={roles}
                            branchHierarchy={branchHierarchy}
                            branchesHierarchyLoading={branchesHierarchyLoading}
                            selectedCity={selectedCity}
                            onCityChange={setSelectedCity}
                        />
                    )}

                </CardContent>
            </Card>



        </div>
    );
};

export default UserPage;
