import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const MealLogDialog = () => {
  const [mealName, setMealName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealName || !selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please provide both a meal name and photo.",
        variant: "destructive",
      });
      return;
    }

    // Here we would typically upload the image and save the meal data
    toast({
      title: "Meal Logged Successfully",
      description: `${mealName} has been logged.`,
    });

    // Reset form
    setMealName("");
    setSelectedFile(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 sm:flex-initial items-center gap-2">
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Log Meal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a Meal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meal-name">Meal Name</Label>
            <Input
              id="meal-name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Enter meal name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meal-photo">Meal Photo</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Input
                id="meal-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="meal-photo"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : "Click to upload photo"}
                </span>
              </Label>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Save Meal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};