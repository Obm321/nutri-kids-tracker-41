import { supabase } from "@/lib/supabase";

export const StorageService = {
  async uploadFile(bucketName: string, file: File) {
    try {
      console.log('Starting file upload to bucket:', bucketName);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      console.log('Uploading file:', fileName);
      
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('File uploaded successfully. Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }
};