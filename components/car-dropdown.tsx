import { useFetchCars } from '@/hooks/useQuery';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/lib/validators/form.validator';
import { ICar } from '@/lib/types/car.type';

interface CarDropdownProps {
    form: UseFormReturn<FormValues>;
}

export default function CarDropdown({form}: CarDropdownProps) {
    const { data, isLoading, error } = useFetchCars();

    const cars = (data || []) as ICar[]

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {(error as Error).message} </p>;

    return (
        <>
            <Label htmlFor={"carId"}>Car Id</Label>
            <Select value={form.watch("carId") ? form.watch("carId").toString() : ""} onValueChange={(value) => form.setValue("carId", parseInt(value))}>
                <SelectTrigger>
                    <SelectValue placeholder="Select car from the list" />
                </SelectTrigger>
                <SelectContent>
                    {cars.map(c => <SelectItem key={c.id} value={c.id.toString()} > {c.make}</SelectItem>)}
                </SelectContent>
            </Select>
        </>
    );
}
