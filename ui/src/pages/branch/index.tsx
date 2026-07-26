import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { apiServices } from '@/src/apis';
import { Trash2, Edit } from 'lucide-react';
import { ComboboxField } from '@/src/components/ui/Combobox';


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/src/components/ui/alert-dialog';
import { AlertModal } from '@/src/components/ui';

const branchSchema = z.object({
    id: z.number().optional(),
    cityId: z.number(),
    title: z.string().min(1, { message: "نام شعبه الزامی است" }),
    isActive: z.boolean(),
    departmentIds: z.array(z.number()).optional(),


});

type BranchFormValues = z.infer<typeof branchSchema>;

interface Branch {
    id: number;
    title: string;
    cityId: number,
    isActive: boolean;
}

const BranchPage = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const queryClient = useQueryClient();


    const { data: departments, isLoading: departmentsLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: apiServices.department.list,
    });

    const { data: branches = [], isLoading } = useQuery<Branch[]>({
        queryKey: ['branches'],
        queryFn: apiServices.branch.list,
    });




    const { data: cities, isLoading: citiesLoading } = useQuery({
        queryKey: ['cities'],
        queryFn: apiServices.city.list,
    });


    const { register, watch, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<BranchFormValues>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            title: '',
            isActive: true,
        }
    });

    const watchId = watch("id");


    const createMutation = useMutation({
        mutationFn: (model: BranchFormValues) => apiServices.branch.create(model),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            reset();
            setIsAddDialogOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (model: BranchFormValues) => apiServices.branch.update(model!.id, model),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            reset();
            setIsAddDialogOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => apiServices.department.delete(selectedDepartment!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
        },
    });

    const onSubmit = (data: BranchFormValues) => {

        if (data.id) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }

    }


    const openEditDialog = (branch: Branch) => {
        reset(branch);
        setIsAddDialogOpen(true);
    };

    const openDeleteDialog = (branch: Branch) => {
    };

    const openAddDialog = () => {
        reset({ title: '', id: 0, isActive: false });
        setIsAddDialogOpen(true);

    }

    return (
        <div dir="rtl" className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>لیست شعبه</CardTitle>
                    <Button onClick={() => openAddDialog()}>افزودن واحد جدید</Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p>در حال بارگذاری...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>شهر</TableHead>
                                    <TableHead> شعبه</TableHead>
                                    <TableHead>واحد ها</TableHead>
                                    <TableHead>وضعیت</TableHead>
                                    <TableHead>عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.map((unit, index) => (
                                    <TableRow key={unit.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{unit.cityName}</TableCell>
                                        <TableCell className="font-medium">{unit.title}</TableCell>
                                        <TableCell>
                                            {unit.departments.map(d => (
                                                <Badge key={d.id} variant="secondary">{d.title}</Badge>
                                            ))}


                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={unit.isActive ? 'success' : 'destructive'}>
                                                {unit.isActive ? 'فعال' : 'غیرفعال'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4">

                                                <Edit className="h-4 w-4 text-green-700 cursor-pointer" onClick={() => openEditDialog(unit)} />
                                                <Trash2 className="h-4 w-4 text-red-500 cursor-pointer" onClick={() => openDeleteDialog(unit)} />

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>افزودن شعبه جدید</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">شهر</Label>
                            <Controller
                                name="cityId"
                                control={control}
                                rules={{ required: 'لطفاً شهر را انتخاب کنید' }}
                                render={({ field: { value, onChange } }) => (
                                    <ComboboxField
                                        options={cities || []}
                                        placeholder="انتخاب شهر"
                                        idKey="id"
                                        titleKey="name"
                                        value={value}          // ← from RHF
                                        onChange={onChange}    // ← updates RHF
                                    />)}
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">نام شعبه</Label>
                            <Input
                                id="title"
                                {...register('title')}
                                error={errors.title}
                                placeholder="مثال:  مرکزی"
                            />



                        </div>
                        <div className="flex items-center gap-2">
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="isActive"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="isActive">فعال</Label>
                        </div>

                        <div className="grid grid-cols-4 gaps-4">

                            <Controller
                                name="departmentIds"
                                control={control}
                                defaultValue={[]} // Start with an empty array
                                render={({ field }) => (
                                    <>
                                        {departments && departments.map((dept) => (
                                            <div key={dept.id} className="flex gap-2 items-center mt-4">
                                                <Checkbox
                                                    id={`dept-${dept.id}`}
                                                    // Check if the department's ID is in the form's array value
                                                    checked={field.value?.includes(dept.id)}
                                                    onCheckedChange={(checked) => {
                                                        const currentIds = field.value || [];
                                                        let newIds;

                                                        if (checked) {
                                                            // If checked, add the new ID to the array
                                                            newIds = [...currentIds, dept.id];
                                                        } else {
                                                            // If unchecked, remove the ID from the array
                                                            newIds = currentIds.filter((id) => id !== dept.id);
                                                        }
                                                        // Update the form state with the new array
                                                        field.onChange(newIds);
                                                    }}
                                                />
                                                <Label htmlFor={`dept-${dept.id}`}>{dept.title}</Label>
                                            </div>
                                        ))}
                                    </>
                                )}
                            />



                        </div>



                        <DialogFooter>
                            <Button type="submit" isLoading={createMutation.isPending}>
                                {(watchId ?? 0) > 0 ? 'ویرایش' : 'ایجاد'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                انصراف
                            </Button>
                        </DialogFooter>


                        <AlertModal
                            type={
                                createMutation.isError || updateMutation.isError
                                    ? "error"
                                    : undefined
                            }
                            message={
                                createMutation.isError
                                    ? createMutation.error?.message
                                    : updateMutation.isError
                                        ? updateMutation.error?.message
                                        : ""
                            }
                            show={createMutation.isError || updateMutation.isError}
                            onClose={() => {
                                createMutation.reset();
                                updateMutation.reset();
                            }}
                            autoClose={true}
                            autoCloseDelay={6000}
                        />



                    </form>
                </DialogContent>
            </Dialog>


        </div>
    );
};

export default BranchPage;
