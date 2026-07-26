import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { apiServices } from '@/src/apis';
import { Trash2, Edit, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';

import {
  AlertDialog,

} from '@/src/components/ui/alert-dialog';


const messageTemplateSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, { message: "عنوان قالب الزامی است" }),
    description: z.string().min(1, { message: "محتوای پیام الزامی است" }),
});

type MessageTemplateFormValues = z.infer<typeof messageTemplateSchema>;

interface MessageTemplate {
    id: number;
    title: string;
    description: string;
}

const MessageTemplatePage = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
    const queryClient = useQueryClient();

    const { data: templates = [], isLoading } = useQuery<MessageTemplate[]>({
        queryKey: ['messageTemplates'],
        queryFn: apiServices.messageTemplate.list,
    });

    const { register, watch, handleSubmit, reset, control, formState: { errors } } = useForm<MessageTemplateFormValues>({
        resolver: zodResolver(messageTemplateSchema),
        defaultValues: {
            title: '',
            description: '',
            isActive: true,
        }
    });

    const watchId = watch("id");

    const createMutation = useMutation({
        mutationFn: (newTemplate: MessageTemplateFormValues) => apiServices.messageTemplate.create(newTemplate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messageTemplates'] });
            reset();
            setIsAddDialogOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (updatedTemplate: MessageTemplateFormValues) => 
            apiServices.messageTemplate.create(updatedTemplate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messageTemplates'] });
            reset();
            setIsAddDialogOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => apiServices.messageTemplate.remove(selectedTemplate!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messageTemplates'] });
            setIsDeleteDialogOpen(false);
            setSelectedTemplate(null);
        },
    });

    const onSubmit = (data: MessageTemplateFormValues) => {
        if (data.id) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    }

    const openEditDialog = (template: MessageTemplate) => {
        reset(template);
        setIsAddDialogOpen(true);
    };

    const openDeleteDialog = (template: MessageTemplate) => {
        setSelectedTemplate(template);
        setIsDeleteDialogOpen(true);
    };

    const openAddDialog = () => {
        reset({ title: '', description: '', id: 0, isActive: true });
        setIsAddDialogOpen(true);
    }

    const handleDelete = () => {
       
        deleteMutation.mutate();
    };

    return (
        <div dir="rtl" className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        لیست قالب‌های پیام
                    </CardTitle>
                    <Button onClick={() => openAddDialog()}>افزودن قالب جدید</Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p>در حال بارگذاری...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>عنوان قالب</TableHead>
                                    <TableHead>محتوای پیام</TableHead>
                                    <TableHead>عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.map((template, index) => (
                                    <TableRow key={template.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{template.title}</TableCell>
                                        <TableCell className="max-w-md">
                                            <div className="line-clamp-2 text-sm text-gray-600">
                                                {template.description}
                                            </div>
                                        </TableCell>
                                     
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Edit 
                                                    className="h-4 w-4 text-green-700 cursor-pointer" 
                                                    onClick={() => openEditDialog(template)} 
                                                />
                                                <Trash2 
                                                    className="h-4 w-4 text-red-500 cursor-pointer" 
                                                    onClick={() => openDeleteDialog(template)} 
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {(watchId ?? 0) > 0 ? 'ویرایش قالب پیام' : 'افزودن قالب پیام جدید'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">عنوان قالب</Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="مثال: تایید دریافت درخواست"
                            />
                            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">محتوای پیام</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="متن پیام را وارد کنید..."
                                className="min-h-[150px]"
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                        </div>

                     

                        <DialogFooter>
                            <Button 
                                onClick={handleSubmit(onSubmit)}
                                isLoading={createMutation.isPending || updateMutation.isPending}
                            >
                                {(watchId ?? 0) > 0 ? 'ویرایش' : 'ایجاد'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsAddDialogOpen(false)}
                            >
                                انصراف
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}

              
     <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="حذف الگو"
        description="آیا مطمئن هستید ؟"
        isLoading={deleteMutation.isPending}
        buttons={[
          {
            text: deleteMutation.isPending ? 'در حال لغو...' : 'بله، حذف شود',
            onClick: ()=>handleDelete(),
            variant: 'destructive',
            className: 'flex-1',
          },
          {
            text: 'خیر',
            onClick: ()=>setIsDeleteDialogOpen(false),
            variant: 'outline',
            className:"flex-1"
          },
        ]}
      />

           
        </div>
    );
};

export default MessageTemplatePage;