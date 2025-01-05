import { supabase } from "@/lib/supabase";

export const StorageService = {
  async ensureBucket(bucketName: string) {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        const { error: createError } = await supabase.storage
          .createBucket(bucketName, {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2 // 2MB
          });
          
        if (createError) throw createError;
      }
      
      // Set bucket policy to allow authenticated users to upload
      const { error: policyError } = await supabase.storage.from(bucketName).createSignedUploadUrl('policy.txt');
      if (policyError) throw policyError;
      
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
      
      const { error: uploadError } = await supabase.storage
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