import { useFetchUsers } from '@/hooks/useQuery';
import { IUser } from '@/lib/types/user.type';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/lib/validators/form.validator';

interface UserDropdownProps {
  form: UseFormReturn<FormValues>;
  fieldName: "reportedById" | "assignedToId";
  label: string
}

export default function UserDropdown({ form, fieldName, label }: UserDropdownProps) {
    const { data, isLoading, error } = useFetchUsers();

    const users = (data || []) as IUser[]

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {(error as Error).message} </p>;

    return (
        <>
            <Label htmlFor={fieldName}>{label}</Label>
            <Select value={form.watch(fieldName) ? form.watch(fieldName)?.toString() : ""} onValueChange={(value) => form.setValue(fieldName, parseInt(value))}>
                <SelectTrigger>
                    <SelectValue placeholder="Select user from the list" />
                </SelectTrigger>
                <SelectContent>
                    {users.map(u => <SelectItem key={u.id} value={u.id.toString()} > {u.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </>
    );
}
