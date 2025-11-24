import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { InternetPackage } from "@/types/package";

export function PackageManagement() {
  const [packages, setPackages] = useState<InternetPackage[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<InternetPackage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockPackages: InternetPackage[] = [
      {
        id: '1',
        name: 'Paket Basic',
        speed: '10 Mbps',
        price: 150000,
        description: 'Paket internet basic untuk kebutuhan dasar',
        isActive: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Paket Premium',
        speed: '20 Mbps',
        price: 250000,
        description: 'Paket internet premium untuk kebutuhan berat',
        isActive: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      },
      {
        id: '3',
        name: 'Paket Ultra',
        speed: '50 Mbps',
        price: 450000,
        description: 'Paket internet ultra cepat',
        isActive: false,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      },
    ];
    setPackages(mockPackages);
  }, []);

  const handleAddPackage = (packageData: Omit<InternetPackage, 'id' | 'created_at' | 'updated_at'>) => {
    const newPackage: InternetPackage = {
      ...packageData,
      id: crypto.randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    setPackages(prev => [...prev, newPackage]);
    toast({
      title: "Paket Ditambahkan",
      description: `Paket ${packageData.name} berhasil ditambahkan.`,
    });
  };

  const handleEditPackage = (packageData: InternetPackage) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageData.id 
        ? { ...packageData, updatedAt: new Date() }
        : pkg
    ));
    toast({
      title: "Paket Diperbarui",
      description: `Paket ${packageData.name} berhasil diperbarui.`,
    });
  };

  const handleDeletePackage = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (window.confirm(`Apakah Anda yakin ingin menghapus paket ${pkg?.name}?`)) {
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      toast({
        title: "Paket Dihapus",
        description: `Paket ${pkg?.name} berhasil dihapus.`,
      });
    }
  };

  const handleToggleActive = (id: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === id 
        ? { ...pkg, isActive: !pkg.isActive, updatedAt: new Date() }
        : pkg
    ));
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Paket Internet</h2>
          <p className="text-sm text-muted-foreground">Kelola paket internet yang tersedia</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Paket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Paket Internet Baru</DialogTitle>
            </DialogHeader>
            <PackageForm onSubmit={handleAddPackage} onCancel={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`${!pkg.isActive ? 'opacity-60' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
              </div>
              <Badge variant={pkg.isActive ? "default" : "secondary"}>
                {pkg.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{pkg.speed}</div>
                <div className="text-xl font-semibold">{formatCurrency(pkg.price)}/bulan</div>
              </div>
              
              {pkg.description && (
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={pkg.isActive}
                  onCheckedChange={() => handleToggleActive(pkg.id)}
                />
                <Label className="text-sm">
                  {pkg.isActive ? 'Aktif' : 'Nonaktif'}
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingPackage(pkg);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingPackage && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Paket Internet</DialogTitle>
            </DialogHeader>
            <PackageForm 
              initialData={editingPackage}
              onSubmit={(data) => {
                handleEditPackage({ ...data, id: editingPackage.id, created_at: editingPackage.created_at, updated_at: new Date() } as InternetPackage);
                setIsEditModalOpen(false);
                setEditingPackage(null);
              }} 
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingPackage(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface PackageFormProps {
  initialData?: InternetPackage;
  onSubmit: (data: Omit<InternetPackage, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

function PackageForm({ initialData, onSubmit, onCancel }: PackageFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    speed: initialData?.speed || '',
    price: initialData?.price || 0,
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nama Paket</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Paket Basic, Premium, dll"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="speed">Kecepatan</Label>
        <Input
          id="speed"
          value={formData.speed}
          onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
          placeholder="10 Mbps, 20 Mbps, dll"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="price">Harga per Bulan (Rp)</Label>
        <Input
          id="price"
          type="number"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Deskripsi (Opsional)</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi paket internet"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label>Paket Aktif</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Tambah'} Paket
        </Button>
      </div>
    </form>
  );
}
