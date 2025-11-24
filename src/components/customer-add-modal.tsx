import { useState } from "react";
import { CustomerBill } from "@/types/wifi-billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "./photo-upload";
import { LocationPicker } from "./location-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomerAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: Omit<CustomerBill, 'id' | 'created_at' | 'due_date'>) => void;
}

export function CustomerAddModal({ isOpen, onClose, onAdd }: CustomerAddModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    status: 'pending' as 'paid' | 'pending',
    paymentMethod: 'cash' as 'cash' | 'transfer',
    notes: '',
    phone_number: '',
    address: '',
    package_name: '',
    photo_url: '',
    latitude: undefined,
    longitude: undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      amount: Number(formData.amount), // Ensure amount is a number
    });
    setFormData({ name: '', amount: 0, status: 'pending', paymentMethod: 'cash', notes: '', phone_number: '', address: '', package_name: '', photo_url: '', latitude: undefined, longitude: undefined });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nama Pelanggan</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Nominal Tagihan (Rp)</Label>
            <Input
              type="number"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={formData.status === 'pending' ? 'pending' : (formData.paymentMethod === 'transfer' ? 'paid_transfer' : 'paid_cash')}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'pending') {
                  setFormData({ ...formData, status: 'pending' });
                } else if (val === 'paid_cash') {
                  setFormData({ ...formData, status: 'paid', paymentMethod: 'cash' });
                } else if (val === 'paid_transfer') {
                  setFormData({ ...formData, status: 'paid', paymentMethod: 'transfer' });
                }
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="pending">Belum Bayar</option>
              <option value="paid_cash">Lunas (Tunai)</option>
              <option value="paid_transfer">Lunas (Transfer)</option>
            </select>
          </div>
          <div>
            <Label>Nomor WhatsApp</Label>
            <Input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
          </div>
          <div>
            <Label>Alamat</Label>
            <Input
              placeholder="Alamat lengkap pelanggan"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div>
            <Label>Paket Internet</Label>
            <Input
              placeholder="Nama paket (misal: 10 Mbps, 20 Mbps)"
              value={formData.package_name}
              onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
            />
          </div>
          <LocationPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
            customerName={formData.name || 'Pelanggan Baru'}
          />

          <PhotoUpload
            currentPhotoUrl={formData.photo_url}
            onPhotoChange={(photoUrl) => setFormData({ ...formData, photo_url: photoUrl || '' })}
            customerName={formData.name || 'Pelanggan Baru'}
          />

          <div>
            <Label>Catatan (Opsional)</Label>
            <Input
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              Tambah
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}