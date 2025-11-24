import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

interface ProofUploadProps {
    currentProofUrl?: string;
    onProofChange: (proofUrl: string | null) => void;
    customerName: string;
}

export function ProofUpload({ currentProofUrl, onProofChange, customerName }: ProofUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentProofUrl || null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError('File harus berupa gambar');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('Ukuran file maksimal 5MB');
            return;
        }

        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${customerName.replace(/\s+/g, '-')}.${fileExt}`;
            const filePath = `transfer-proofs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('customer-files')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('customer-files')
                .getPublicUrl(filePath);

            setPreviewUrl(publicUrl);
            onProofChange(publicUrl);
            showSuccess('Bukti transfer berhasil diupload');
        } catch (error: any) {
            console.error('Error uploading proof:', error);
            showError('Gagal mengupload bukti transfer');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveProof = () => {
        setPreviewUrl(null);
        onProofChange(null);
        showSuccess('Bukti transfer dihapus');
    };

    return (
        <div className="space-y-2">
            <Label>Bukti Transfer (Opsional)</Label>

            {previewUrl ? (
                <div className="relative border rounded-lg p-2">
                    <img
                        src={previewUrl}
                        alt="Bukti Transfer"
                        className="w-full h-48 object-contain rounded"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveProof}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                        Upload bukti transfer (JPG, PNG, max 5MB)
                    </p>
                    <label htmlFor="proof-upload" className="cursor-pointer">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={uploading}
                            onClick={() => document.getElementById('proof-upload')?.click()}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading ? 'Mengupload...' : 'Pilih File'}
                        </Button>
                    </label>
                    <input
                        id="proof-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                </div>
            )}
        </div>
    );
}
