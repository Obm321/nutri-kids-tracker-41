import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface MealLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealType: string | null;
}

export const MealLogDialog = ({ open, onOpenChange, mealType }: MealLogDialogProps) => {
  const [mealName, setMealName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { id: childId } = useParams();
  const queryClient = useQueryClient();

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
          stopCamera();
        }
      }, 'image/jpeg');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const ensureStorageBucket = async () => {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'meal-photos');
      
      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { data, error: createError } = await supabase
          .storage
          .createBucket('meal-photos', {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2 // 2MB
          });
          
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw new Error('Failed to create storage bucket');
        }
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
      throw new Error('Failed to initialize storage');
    }
  };

  const uploadImage = async (file: File) => {
    try {
      await ensureStorageBucket();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meal-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('meal-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealName || !selectedFile || !childId || !mealType) {
      toast({
        title: "Missing Information",
        description: "Please provide both a meal name and photo.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload image and get public URL
      const publicUrl = await uploadImage(selectedFile);

      // Save meal data to the database
      const { error: insertError } = await supabase
        .from('meals')
        .insert([
          {
            child_id: childId,
            name: mealName,
            type: mealType,
            photo_url: publicUrl,
            date: new Date().toISOString(),
            carbs: 0,
            protein: 0,
            fat: 0,
            calories: 0,
          }
        ]);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `${mealName} has been logged.`,
      });

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meals', childId] });

      setMealName("");
      setSelectedFile(null);
      stopCamera();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving meal:', error);
      toast({
        title: "Error",
        description: "Failed to save meal information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log {mealType} Meal</DialogTitle>
          <DialogDescription>
            Add details about your meal including a photo.
          </DialogDescription>
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
              <Label>Meal Photo</Label>
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
          
          <Button type="submit" className="w-full" disabled={showCamera}>
            Save Meal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
