import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dropdown = ({...field}) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Role"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Admin</SelectItem>
        <SelectItem value="dark">User</SelectItem>
      </SelectContent>
    </Select>
  );
};


export default Dropdown;