import { useState, useRef } from "react";
import { Camera, Upload, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  customerName: string;
}

export function PhotoUpload({ currentPhotoUrl, onPhotoChange, customerName }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${customerName.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
      const filePath = `customer-photos/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('customer-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('customer-photos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "File Tidak Valid",
        description: "Mohon pilih file gambar (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Terlalu Besar",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const uploadedUrl = await uploadToSupabase(file);
      
      if (uploadedUrl) {
        setPreviewUrl(uploadedUrl);
        onPhotoChange(uploadedUrl);
        
        toast({
          title: "Foto Berhasil Diupload",
          description: `Foto rumah ${customerName} telah diperbarui`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload Gagal",
        description: error.message || "Gagal mengupload foto ke server",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (currentPhotoUrl && currentPhotoUrl.includes('supabase.co')) {
      try {
        // Extract file path from URL
        const urlParts = currentPhotoUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `customer-photos/${fileName}`;

        // Delete from Supabase Storage
        const { error } = await supabase.storage
          .from('customer-photos')
          .remove([filePath]);

        if (error) {
          console.error('Delete error:', error);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }

    setPreviewUrl(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Foto Dihapus",
      description: `Foto rumah ${customerName} telah dihapus`,
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm sm:text-base font-medium">Foto Rumah</label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4">
        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative">
              <img 
                src={previewUrl} 
                alt={`Rumah ${customerName}`}
                className="w-full h-24 sm:h-32 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto modal-content">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Foto Rumah {customerName}</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img 
                      src={previewUrl} 
                      alt={`Rumah ${customerName}`}
                      className="max-w-full max-h-64 sm:max-h-96 object-contain rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={triggerFileInput}
                disabled={isUploading}
                className="w-full sm:w-auto"
              >
                <Camera className="h-4 w-4 mr-1" />
                {isUploading ? 'Uploading...' : 'Ganti'}
              </Button>
              
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={handleRemovePhoto}
                className="text-red-600 hover:text-red-700 w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-1" />
                Hapus
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Belum ada foto rumah untuk {customerName}
            </p>
            <Button 
              type="button"
              variant="outline" 
              onClick={triggerFileInput}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Foto'}
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500">
        Format: JPG, PNG, GIF. Maksimal 5MB.
      </p>
    </div>
  );
}

