import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { ComboboxField } from '@/src/components/ui/Combobox';
import { Input } from '@/src/components/ui';

interface Appointment {
    id: number;
    dateTime: string;
    city: string;
    branch: string;
    unit: string;
    status: 'در انتظار' | 'تایید شده' | 'لغو شده';
    response: string;
}

// Mock data
const cities = [
    { value: 'تهران', label: 'تهران' },
    { value: 'اصفهان', label: 'اصفهان' },
    { value: 'شیراز', label: 'شیراز' },
];
const units =[
    { value: 'پشتیبانی فنی', label: 'پشتیبانی فنی' },
    { value: 'امور مالی', label: 'امور مالی' },
    { value: 'فروش', label: 'فروش' },
];
const branches: Record<string,[]> = {
    'تهران': [{ value: 'شعبه مرکزی', label: 'شعبه مرکزی' }, { value: 'شعبه غرب', label: 'شعبه غرب' }],
    'اصفهان': [{ value: 'شعبه اصفهان', label: 'شعبه اصفهان' }],
    'شیراز': [{ value: 'دفتر شیراز', label: 'دفتر شیراز' }]
};
const availableTimes = [
    { value: '09:00 - 10:00', label: '09:00 - 10:00' },
    { value: '10:00 - 11:00', label: '10:00 - 11:00' },
    { value: '11:00 - 12:00', label: '11:00 - 12:00' },
    { value: '14:00 - 15:00', label: '14:00 - 15:00' },
];

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: 1, dateTime: '1403/05/10 - 10:30', city: 'تهران', branch: 'شعبه مرکزی', unit: 'پشتیبانی فنی', status: 'تایید شده', response: 'مشکل با موفقیت حل شد.' },
        { id: 2, dateTime: '1403/05/12 - 14:00', city: 'اصفهان', branch: 'شعبه اصفهان', unit: 'فروش', status: 'در انتظار', response: '-' },
    ]);

    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    const branchOptions = useMemo(() => {
        if (!selectedCity) return [];
        return branches[selectedCity] || [];
    }, [selectedCity]);

    // Reset branch when city changes
    React.useEffect(() => {
        setSelectedBranch('');
    }, [selectedCity]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedCity || !selectedUnit || !selectedBranch || !selectedTime) {
            // Maybe show an error message
            return;
        }

        const newAppointment: Appointment = {
            id: Math.max(0, ...appointments.map(a => a.id)) + 1,
            dateTime: `1403/05/15 - ${selectedTime.split(' ')[0]}`, // Simplified date
            city: selectedCity,
            branch: selectedBranch,
            unit: selectedUnit,
            status: 'در انتظار',
            response: '-',
        };

        setAppointments([...appointments, newAppointment]);

        // Reset form
        setSelectedCity('');
        setSelectedUnit('');
        setSelectedBranch('');
        setSelectedTime('');
    };
    
    const getStatusVariant = (status: Appointment['status']) => {
        switch (status) {
            case 'تایید شده': return 'success';
            case 'لغو شده': return 'destructive';
            case 'در انتظار': return 'default';
            default: return 'secondary';
        }
    };

    return (
        <div dir="rtl" className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>رزرو وقت حضوری</CardTitle>
                    <CardDescription>برای دریافت خدمات، لطفا فرم زیر را تکمیل و ارسال نمایید.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">شهر</Label>
                                <ComboboxField
                                    options={cities}
                                    value={selectedCity}
                                    onChange={setSelectedCity}
                                    placeholder="انتخاب شهر"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branch">شعبه</Label>
                                <ComboboxField
                                    options={branchOptions}
                                    value={selectedBranch}
                                    onChange={setSelectedBranch}
                                    placeholder="انتخاب شعبه"
                                    disabled={!selectedCity}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit">واحد</Label>
                                <ComboboxField
                                    options={units}
                                    value={selectedUnit}
                                    onChange={setSelectedUnit}
                                    placeholder="انتخاب واحد"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="time">ساعت مراجعه</Label>
                                <ComboboxField
                                    options={availableTimes}
                                    value={selectedTime}
                                    onChange={setSelectedTime}
                                    placeholder="انتخاب ساعت"
                                />
                            </div>

                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="time">علت حضور </Label>
                                <Input 
                                className='col-span-2'
                                id="title"
                                placeholder="مثال:  مرکزی"
                            />
                            </div>

                        </div>
                        <div className="flex justify-end pt-2">
                            <Button type="submit">ثبت درخواست</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>وقت‌های رزرو شده</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>تاریخ و ساعت</TableHead>
                                <TableHead>شعبه</TableHead>
                                <TableHead>واحد</TableHead>
                                <TableHead>وضعیت</TableHead>
                                <TableHead>زمان پاسخگویی</TableHead>
                                <TableHead>پاسخ نهایی</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.dateTime}</TableCell>
                                    <TableCell>{app.city} - {app.branch}</TableCell>
                                    <TableCell>{app.unit}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(app.status)}>
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{app.response}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AppointmentsPage;
