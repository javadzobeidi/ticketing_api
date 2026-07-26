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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/src/components/ui/alert-dialog';
import { TreeList } from '@/src/components/ui';

const departmentSchema = z.object({
      id: z.number().optional(),
    title: z.string().min(1, { message: "نام واحد الزامی است" }),
    isActive: z.boolean(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface Department {
    id: number;
    title: string;
    isActive: boolean;
}

const DepartmentPage = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const queryClient = useQueryClient();
const [selectedChildId,setSelectedChildId]=useState(null);
     const { data: cities, isLoading: citiesLoading } = useQuery({
            queryKey: ['cities'],
            queryFn: apiServices.city.list,
        });
    
     
          const { data: treeDepartments = [], isLoading:isLoadingTreeDepartments } = useQuery<Department[]>({
        queryKey: ['departmentsTree'],
        queryFn: apiServices.department.listByHierarchy,
    });



    const { data: units = [], isLoading } = useQuery<Department[]>({
        queryKey: ['departments'],
        queryFn: apiServices.department.list,
    });


    const { register,watch, handleSubmit, reset, control, formState: { errors } } = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            title: '',
            isActive: true,
        }
    });

    const watchId=watch("id");


    const createMutation = useMutation({
        mutationFn: (newDepartment: DepartmentFormValues) => apiServices.department.create(newDepartment),
        onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ['departments'] });
           reset();
           setIsAddDialogOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (updatedDepartment: DepartmentFormValues) => apiServices.department.update(updatedDepartment!.id, updatedDepartment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
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

    const onSubmit = (data: DepartmentFormValues) => {
       if (data.id) {

    updateMutation.mutate(data);
  } else {
    createMutation.mutate({childId:selectedChildId, ...data});
  }

}

   
    const openEditDialog = (department: Department) => {
        reset(department);
        setIsAddDialogOpen(true);
    };

    const openDeleteDialog = (department: Department) => {
    };

    const openAddDialog=()=>{
           reset({title:'',id:0,isActive:false});
        setIsAddDialogOpen(true);

    }
const onSelected=(id)=>{
setSelectedChildId(id)
setIsAddDialogOpen(true);
}
    return (
        <div dir="rtl" className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>لیست واحدها</CardTitle>
                    <Button onClick={() =>openAddDialog()}>افزودن واحد جدید</Button>
                </CardHeader>
                <CardContent>
                      {isLoadingTreeDepartments ? (
                        <p>در حال بارگذاری...</p>
                    ) : (

                    <TreeView items={treeDepartments} showSearch={true} onSelectedNode={onSelected}/>)}


                    {isLoading ? (
                        <p>در حال بارگذاری...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>نام واحد</TableHead>
                                    <TableHead>وضعیت</TableHead>
                                    <TableHead>عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.map((unit, index) => (
                                    <TableRow key={unit.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{unit.title}</TableCell>
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
                        <DialogTitle>افزودن واحد جدید</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">نام واحد</Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="مثال: پشتیبانی فنی"
                            />
                            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
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
                        <DialogFooter>
                            <Button type="submit" isLoading={createMutation.isPending}>
                                    {(watchId ?? 0) > 0 ? 'ویرایش' : 'ایجاد'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                انصراف
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        
          
        </div>
    );
};



// Example usage with demo data
function TreeView({items=[]}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);



  const columns: ColumnConfig[] = [
    {
      key: 'isActive',
      label: 'فعال',
      width: '80px',
      render: (value: boolean) => (
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
          value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {value ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      )
    },
    {
      key: 'isShow',
      label: 'نمایش',
      width: '80px',
      render: (value: boolean) => (
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
          value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {value ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          )}
        </span>
      )
    }
  ];

 

  return (
      
        
        <TreeList
          data={items}
          value={selectedId}
          onChange={setSelectedId}
          idKey="id"
          titleKey="title"
          isLoading={isLoading}
          showSearch={false}
          defaultExpandAll={false}
          columns={columns}
        />

      
     
  );
}



export default DepartmentPage;
