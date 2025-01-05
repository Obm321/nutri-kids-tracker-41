import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";
import { MealService } from "@/services/meals";

interface MealPhotoInputProps {
  mealType: string | null;
  selectedDate: Date;
  onSuccess: () => void;
}

export const MealPhotoInput = ({ mealType, selectedDate, onSuccess }: MealPhotoInputProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { id: childId } = useParams();

  const handleMealSubmit = async (file: File) => {
    if (!childId || !mealType) return;

    try {
      await MealService.createMeal({
        childId,
        name: "Meal Photo",
        type: mealType,
        photoFile: file,
        dateTime: selectedDate,
      });

      toast({
        title: "Success",
        description: "Meal logged successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting meal:', error);
      toast({
        title: "Error",
        description: "Failed to log meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-meal.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
          handleMealSubmit(file);
          stopCamera();
        }
      }, 'image/jpeg');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleMealSubmit(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Meal Photo</Label>
      {showCamera ? (
        <div className="space-y-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={capturePhoto}
              className="flex-1"
            >
              Capture Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={stopCamera}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={startCamera}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
            <div className="relative flex-1">
              <Input
                id="meal-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="meal-photo"
                className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Label>
            </div>
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground mt-2">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};