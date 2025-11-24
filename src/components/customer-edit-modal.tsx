import { useState, useEffect } from "react";
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
import { formatCurrency } from "@/lib/utils";

interface CustomerEditModalProps {
  customer: CustomerBill | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: CustomerBill) => void;
}

export function CustomerEditModal({ customer, isOpen, onClose, onSave }: CustomerEditModalProps) {
  const [formData, setFormData] = useState<CustomerBill | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        paymentMethod: customer.paymentMethod || 'cash' // Default to cash if not set
      });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave({ ...formData, amount: Number(formData.amount) });
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto modal-content">
        <div className="h-full flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl">Edit Data Pelanggan</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1">
                <Label className="text-sm sm:text-base">Nama Pelanggan</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm sm:text-base">Nominal Tagihan (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                  required
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm sm:text-base">Status</Label>
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
                  className="w-full p-2 border rounded-md text-sm sm:text-base"
                >
                  <option value="pending">Belum Bayar</option>
                  <option value="paid_cash">Lunas (Tunai)</option>
                  <option value="paid_transfer">Lunas (Transfer)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm sm:text-base">Nomor WhatsApp</Label>
                <Input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.phone_number || ''}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm sm:text-base">Alamat</Label>
                <Input
                  placeholder="Alamat lengkap pelanggan"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm sm:text-base">Paket Internet</Label>
                <Input
                  placeholder="Nama paket (misal: 10 Mbps, 20 Mbps)"
                  value={formData.package_name || ''}
                  onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>
              <LocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                customerName={formData.name || 'Pelanggan'}
              />

              <PhotoUpload
                currentPhotoUrl={formData.photo_url}
                onPhotoChange={(photoUrl) => setFormData({ ...formData, photo_url: photoUrl || '' })}
                customerName={formData.name || 'Pelanggan'}
              />

              <div className="space-y-1">
                <Label className="text-sm sm:text-base">Catatan (Opsional)</Label>
                <Input
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4 flex-shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button type="submit" onClick={handleSubmit} className="w-full sm:w-auto">
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}