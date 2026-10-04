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
import { Badge } from '@/src/components/ui/badge';
import { apiServices } from '@/src/apis';
import { Trash2, Edit, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { AlertModal, TreeList } from '@/src/components/ui';

// شمای اعتبارسنجی فرم
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
    parentId?: number | null;
}

const DepartmentPage = () => {
    const queryClient = useQueryClient();
    
    // وضعیت‌های مودال‌ها
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // وضعیت‌های مربوط به دیتای در حال عملیات
    const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

    // وضعیت برای نمایش AlertModal (پیام‌های موفقیت/خطا)
    const [alertState, setAlertState] = useState<{ show: boolean, type: "success" | "error" | undefined, message: string }>({
        show: false,
        type: undefined,
        message: ""
    });

    const showAlert = (type: "success" | "error", message: string) => {
        setAlertState({ show: true, type, message });
    };

    // دریافت لیست درختی واحدها
    const { data: treeDepartments = [], isLoading: isLoadingTreeDepartments } = useQuery<Department[]>({
        queryKey: ['departmentsTree'],
        queryFn: apiServices.department.listByHierarchy,
    });

    // تنظیمات فرم
    const { register, watch, handleSubmit, reset, control, formState: { errors } } = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            title: '',
            isActive: true,
        }
    });

    const watchId = watch("id");

    // Mutation ها
    const createMutation = useMutation({
        mutationFn: (newDepartment: any) => apiServices.department.create(newDepartment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departmentsTree'] });
            reset();
            setIsAddDialogOpen(false);
            showAlert("success", "واحد جدید با موفقیت ایجاد شد");
        },
        onError: (error: any) => {
            showAlert("error", error?.message || "خطا در ایجاد واحد");
        }
    });

    const updateMutation = useMutation({
        mutationFn: (updatedDepartment: DepartmentFormValues) => apiServices.department.update(updatedDepartment.id!, updatedDepartment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departmentsTree'] });
            reset();
            setIsAddDialogOpen(false);
            showAlert("success", "اطلاعات واحد با موفقیت بروزرسانی شد");
        },
        onError: (error: any) => {
            showAlert("error", error?.message || "خطا در بروزرسانی واحد");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => apiServices.department.delete(departmentToDelete!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departmentsTree'] });
            setIsDeleteDialogOpen(false);
            setDepartmentToDelete(null);
            showAlert("success", "واحد با موفقیت حذف شد");
        },
        onError: (error: any) => {
            setIsDeleteDialogOpen(false);
            showAlert("error", error?.message || "خطا در حذف واحد");
        }
    });

    // عملیات ثبت فرم
    const onSubmit = (data: DepartmentFormValues) => {
        if (data.id) {
            // حالت ویرایش
            updateMutation.mutate(data);
        } else {
            // حالت ایجاد (ارسال parentId در صورت وجود)
            createMutation.mutate({ parentId: selectedParentId, ...data });
        }
    };

    // باز کردن فرم برای افزودن واحد اصلی (بدون والد)
    const openAddDialog = () => {
        setSelectedParentId(null);
        reset({ title: '', id: 0, isActive: true });
        setIsAddDialogOpen(true);
    };

    // باز کردن فرم برای افزودن زیرمجموعه
    const openAddChildDialog = (parentDept: Department) => {
        setSelectedParentId(parentDept.id);
        reset({ title: '', id: 0, isActive: true });
        setIsAddDialogOpen(true);
    };

    // باز کردن فرم برای ویرایش
    const openEditDialog = (department: Department) => {
        reset(department);
        setIsAddDialogOpen(true);
    };

    // باز کردن مودال تایید حذف
    const openDeleteDialog = (department: Department) => {
        setDepartmentToDelete(department);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div dir="rtl" className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>ساختار سازمانی واحدها</CardTitle>
                    <Button onClick={openAddDialog}>افزودن واحد اصلی</Button>
                </CardHeader>
                <CardContent>
                    {isLoadingTreeDepartments ? (
                        <p>در حال بارگذاری...</p>
                    ) : (
                        <TreeView 
                            items={treeDepartments} 
                            onAddChild={openAddChildDialog}
                            onEdit={openEditDialog}
                            onDelete={openDeleteDialog}
                        />
                    )}
                </CardContent>
            </Card>

            {/* مودال افزودن/ویرایش */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {(watchId ?? 0) > 0 ? 'ویرایش واحد' : (selectedParentId ? 'افزودن زیرمجموعه' : 'افزودن واحد اصلی')}
                        </DialogTitle>
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
                            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                                {(watchId ?? 0) > 0 ? 'ذخیره تغییرات' : 'ایجاد'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                انصراف
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        
            {/* مودال تایید حذف با استفاده از Dialog معمولی */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>آیا از حذف این واحد اطمینان دارید؟</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4 text-sm text-gray-700">
                        شما در حال حذف واحد <span className="font-bold text-red-500">"{departmentToDelete?.title}"</span> هستید. این عملیات غیرقابل بازگشت است و ممکن است زیرمجموعه‌های آن نیز حذف شوند.
                    </div>
                    
                    <DialogFooter className="flex items-center gap-2 justify-end">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            انصراف
                        </Button>
                        
                        <Button 
                            type="button" 
                            className="bg-red-500 hover:bg-red-600 text-white" 
                            isLoading={deleteMutation.isPending}
                            onClick={() => deleteMutation.mutate()}
                        >
                            {deleteMutation.isPending ? 'در حال حذف...' : 'بله، حذف شود'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* مودال نمایش پیام‌های موفقیت و خطا */}
            <AlertModal
                type={alertState.type}
                message={alertState.message}
                show={alertState.show}
                onClose={() => setAlertState({ ...alertState, show: false })}
                autoClose={true}
                autoCloseDelay={5000}
            />
        </div>
    );
};

// کامپوننت TreeView برای نمایش ساختار درختی و ستون‌های سفارشی
function TreeView({ items = [], onAddChild, onEdit, onDelete }: any) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const columns = [
        {
            key: 'isActive',
            label: 'وضعیت',
            width: '100px',
            render: (value: boolean) => (
                <Badge variant={value ? 'success' : 'destructive'} className="text-xs">
                    {value ? 'فعال' : 'غیرفعال'}
                </Badge>
            )
        },
        {
            key: 'actions',
            label: 'عملیات',
            width: '150px',
            render: (_: any, item: any) => (
                <div className="flex items-center gap-4">
                    {/* دکمه افزودن فرزند */}
                    <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); onAddChild(item); }}
                        title="افزودن زیرمجموعه"
                    >
                        <Plus className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                    </button>
                    
                    {/* دکمه ویرایش */}
                    <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        title="ویرایش"
                    >
                        <Edit className="h-4 w-4 text-green-600 hover:text-green-800" />
                    </button>

                    {/* دکمه حذف */}
                    <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                        title="حذف"
                    >
                        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </button>
                </div>
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
            showSearch={true}
            defaultExpandAll={false}
            columns={columns}
        />
    );
}

export default DepartmentPage;