import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';

interface Unit {
    id: number;
    name: string;
    isActive: boolean;
}

const UnitsPage = () => {
    const [units, setUnits] = useState<Unit[]>([
        { id: 1, name: 'پشتیبانی فنی', isActive: true },
        { id: 2, name: 'امور مالی', isActive: true },
        { id: 3, name: 'فروش', isActive: false },
    ]);
    const [newUnitName, setNewUnitName] = useState('');
    const [isNewUnitActive, setIsNewUnitActive] = useState(true);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newUnitName.trim()) return;

        const newUnit: Unit = {
            id: Math.max(0, ...units.map(u => u.id)) + 1,
            name: newUnitName,
            isActive: isNewUnitActive,
        };

        setUnits([...units, newUnit]);
        setNewUnitName('');
        setIsNewUnitActive(true);
    };

    return (
        <div dir="rtl" className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>افزودن واحد جدید</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex items-end gap-4">
                        <div className="grid gap-2 flex-grow">
                            <Label htmlFor="unitName">نام واحد</Label>
                            <Input
                                id="unitName"
                                value={newUnitName}
                                onChange={(e) => setNewUnitName(e.target.value)}
                                placeholder="مثال: پشتیبانی فنی"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2 pb-2.5">
                            <Checkbox
                                id="unitStatus"
                                checked={isNewUnitActive}
                                onCheckedChange={setIsNewUnitActive}
                            />
                            <Label htmlFor="unitStatus">فعال</Label>
                        </div>
                        <Button type="submit">افزودن</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>لیست واحدها</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>نام واحد</TableHead>
                                <TableHead>وضعیت</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {units.map((unit, index) => (
                                <TableRow key={unit.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{unit.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={unit.isActive ? 'success' : 'destructive'}>
                                            {unit.isActive ? 'فعال' : 'غیرفعال'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default UnitsPage;
