import { supabase } from "@/lib/supabase";

export const StorageService = {
  async ensureBucket(bucketName: string) {
    try {
      // First check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        // Create new bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true // Make bucket public for now to debug
        });
        if (createError) throw createError;
      }

      // Update bucket configuration
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true, // Make bucket public for now to debug
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });
      
      if (updateError) throw updateError;
      
    } catch (error) {
      console.error('Storage bucket error:', error);
      throw new Error('Failed to initialize storage bucket');
    }
  },

  async uploadFile(bucketName: string, file: File) {
    try {
      await this.ensureBucket(bucketName);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error('Failed to upload file');
    }
  }
};

/* Execute these SQL commands in your Supabase SQL editor:

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all uploads
CREATE POLICY "allow_public_uploads" 
ON storage.objects 
FOR INSERT 
TO public
USING ( bucket_id = 'meal-photos' );

-- Create policy to allow all downloads
CREATE POLICY "allow_public_downloads" 
ON storage.objects 
FOR SELECT 
TO public
USING ( bucket_id = 'meal-photos' );

-- Create policy to allow all deletes
CREATE POLICY "allow_public_deletes" 
ON storage.objects 
FOR DELETE 
TO public
USING ( bucket_id = 'meal-photos' );

*/