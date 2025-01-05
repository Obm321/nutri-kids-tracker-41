import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddChild?: (childData: {
    name: string;
    age: number;
    gender: string;
    height: string;
    weight: string;
  }) => void;
  initialData?: {
    name: string;
    age: number;
    gender: string;
    height: string;
    weight: string;
  };
  isEditing?: boolean;
}

export const AddChildDialog = ({ 
  open, 
  onOpenChange, 
  onAddChild,
  initialData,
  isEditing = false
}: AddChildDialogProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAge(initialData.age.toString());
      setGender(initialData.gender);
      setHeight(initialData.height);
      setWeight(initialData.weight);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age || !gender || !height || !weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    onAddChild?.({
      name,
      age: parseInt(age, 10),
      gender,
      height,
      weight,
    });

    if (!isEditing) {
      toast({
        title: "Success",
        description: "Child profile created successfully.",
      });
      onOpenChange(false);
      setName("");
      setAge("");
      setGender("");
      setHeight("");
      setWeight("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Child Profile' : 'Add Child Profile'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter child's name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
            />
          </div>

          <Button type="submit" className="w-full">
            {isEditing ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};