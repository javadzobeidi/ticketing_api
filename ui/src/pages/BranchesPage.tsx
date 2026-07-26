import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { ComboboxField } from '../components/ui/Combobox';

interface Branch {
    id: number;
    city: string;
    title: string;
    isActive: boolean;
    units: string[]; 
}

export type OptionType = {
    label: string;
    value: string;
};

// Mock data for available units
const allUnits: OptionType[] = [
    { value: 'پشتیبانی فنی', label: 'پشتیبانی فنی' },
    { value: 'امور مالی', label: 'امور مالی' },
    { value: 'فروش', label: 'فروش' },
    { value: 'منابع انسانی', label: 'منابع انسانی' },
];

const TempBranchesPage = () => {

    const [branches, setBranches] = useState<Branch[]>([
        { id: 1, city: 'تهران', title: 'شعبه مرکزی', isActive: true, units: ['پشتیبانی فنی', 'امور مالی', 'فروش'] },
        { id: 2, city: 'اصفهان', title: 'شعبه اصفهان', isActive: true, units: ['فروش', 'پشتیبانی فنی'] },
        { id: 3, city: 'شیراز', title: 'دفتر شیراز', isActive: false, units: ['فروش'] },
    ]);

      const [city, setCity] = useState<string | null>(null)
    

    const cityOptions = [
  { label: "تهران", value: "tehran" },
  { label: "مشهد", value: "mashhad" },
  { label: "اصفهان", value: "isfahan" },
  { label: "شیراز", value: "shiraz" },
  { label: "تبریز", value: "tabriz" },
]


    const [newBranchCity, setNewBranchCity] = useState('');
    const [newBranchTitle, setNewBranchTitle] = useState('');
    const [isNewBranchActive, setIsNewBranchActive] = useState(true);
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

    const handleUnitChange = (checked: boolean | 'indeterminate', unitValue: string) => {
        if (checked) {
            setSelectedUnits([...selectedUnits, unitValue]);
        } else {
            setSelectedUnits(selectedUnits.filter((u) => u !== unitValue));
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newBranchCity.trim() || !newBranchTitle.trim()) return;

        const newBranch: Branch = {
            id: Math.max(0, ...branches.map(b => b.id)) + 1,
            city: newBranchCity,
            title: newBranchTitle,
            isActive: isNewBranchActive,
            units: selectedUnits,
        };

        setBranches([...branches, newBranch]);
        
        // Reset form
        setNewBranchCity('');
        setNewBranchTitle('');
        setIsNewBranchActive(true);
        setSelectedUnits([]);
    };

    return (
        <div dir="rtl" className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>افزودن شعبه جدید</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                               
                                   <div className="space-y-3">
                                              <Label htmlFor="city" className="text-base font-semibold text-foreground flex items-center gap-2">
                                                شهر <span className="text-destructive text-lg">*</span>
                                              </Label>
                                              <ComboboxField
                                                options={cityOptions}
                                                placeholder="انتخاب شهر"
                                                value={city}
                                                onChange={setCity}
                                              />
                                            </div>

                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branchTitle">عنوان شعبه</Label>
                                <Input
                                    id="branchTitle"
                                    value={newBranchTitle}
                                    onChange={(e) => setNewBranchTitle(e.target.value)}
                                    placeholder="مثال: شعبه مرکزی"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>واحدها</Label>
                            <div className="p-3 border rounded-md flex flex-wrap gap-x-6 gap-y-3">
                                {allUnits.map((unit) => (
                                    <div key={unit.value} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`unit-${unit.value}`}
                                            checked={selectedUnits.includes(unit.value)}
                                            onCheckedChange={(checked) => handleUnitChange(checked, unit.value)}
                                        />
                                        <Label htmlFor={`unit-${unit.value}`} className="font-normal cursor-pointer">
                                            {unit.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="branchStatus"
                                    checked={isNewBranchActive}
                                    onCheckedChange={(checked) => setIsNewBranchActive(checked === true)}
                                />
                                <Label htmlFor="branchStatus" className="cursor-pointer">فعال</Label>
                            </div>
                            <Button type="submit">افزودن شعبه</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>لیست شعبه‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>شهر</TableHead>
                                <TableHead>عنوان</TableHead>
                                <TableHead>واحدها</TableHead>
                                <TableHead>وضعیت</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branches.map((branch, index) => (
                                <TableRow key={branch.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{branch.city}</TableCell>
                                    <TableCell>{branch.title}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {branch.units.map(unit => (
                                                <Badge key={unit} variant="secondary">{unit}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={branch.isActive ? 'success' : 'destructive'}>
                                            {branch.isActive ? 'فعال' : 'غیرفعال'}
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

export default TempBranchesPage;
