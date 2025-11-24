// src/components/password-edit-modal.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '../integrations/supabase/client'; // Pastikan path ini benar!
import { useUser } from '../App'; // Untuk mendapatkan user ID

interface PasswordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordEditModal({ isOpen, onClose }: PasswordEditModalProps) {
  const { user, logout } = useUser();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSavePassword = async () => {
    // Pastikan user sedang login di context kita dan memiliki ID
    if (!user || user.id === undefined || user.id === null) {
      toast({
        title: "Gagal",
        description: "ID Pengguna tidak ditemukan. Silakan login ulang.",
        variant: "destructive",
      });
      setIsSaving(false);
      onClose();
      logout(); // Langsung logout jika tidak ada ID pengguna yang valid
      return;
    }

    if (newPassword === '') {
      toast({
        title: "Peringatan",
        description: "Password baru tidak boleh kosong.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Peringatan",
        description: "Konfirmasi password tidak cocok.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    let errorOccurred = false; // Flag untuk melacak error

    try {
      // ✅ Memanggil fungsi RPC yang telah dibuat di database
      // Pastikan `user.id` adalah tipe INT, sesuai dengan parameter p_user_id di fungsi DB.
      const { error } = await supabase.rpc('update_user_password_hash', {
        p_user_id: user.id,          // Pass ID pengguna dari context
        p_new_password_hash: newPassword, // Pass password baru (plaintext)
      });

      if (error) {
        toast({
          title: "Gagal Mengganti Password",
          description: error.message,
          variant: "destructive",
        });
        errorOccurred = true;
      } else {
        toast({
          title: "Sukses",
          description: "Password berhasil diganti.",
        });
        // Tidak perlu logout dari Supabase Auth karena ini otentikasi kustom Anda
        // dan tidak ada sesi Auth Supabase yang dikelola.
        // Jika Anda ingin user login ulang secara paksa setelah ganti password:
        // logout(); // Ini akan menghapus dari localStorage dan redirect ke /login
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan tidak terduga.",
        variant: "destructive",
      });
      errorOccurred = true;
    } finally {
      setIsSaving(false);
      // Tutup modal dan bersihkan input hanya jika tidak ada error yang terjadi
      if (!errorOccurred) {
        onClose();
        setNewPassword('');
        setConfirmPassword('');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ganti Password</DialogTitle>
          <DialogDescription>
            Masukkan password baru Anda. Password akan disimpan sebagai teks biasa.
            **PERINGATAN: Ini sangat tidak disarankan untuk keamanan!**
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              Password Baru
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right">
              Konfirmasi Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Batal</Button>
          <Button onClick={handleSavePassword} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
