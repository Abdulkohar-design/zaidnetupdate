import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface InternetPackage {
    id: string;
    name: string;
    speed: string;
    price: number;
    description: string;
}

export function InternetPackageSettings() {
    const [packages, setPackages] = useState<InternetPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<InternetPackage>>({});
    const [isAdding, setIsAdding] = useState(false);
    const [newPackage, setNewPackage] = useState<Partial<InternetPackage>>({
        name: "",
        speed: "",
        price: 0,
        description: ""
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('internet_packages')
            .select('*')
            .order('price', { ascending: true });

        if (error) {
            console.error('Error fetching packages:', error);
            showError('Gagal memuat daftar paket');
        } else {
            setPackages(data || []);
        }
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!newPackage.name || !newPackage.price) {
            showError('Nama dan harga paket wajib diisi');
            return;
        }

        const { error } = await supabase
            .from('internet_packages')
            .insert([newPackage]);

        if (error) {
            showError('Gagal menambah paket');
        } else {
            showSuccess('Paket berhasil ditambahkan');
            setIsAdding(false);
            setNewPackage({ name: "", speed: "", price: 0, description: "" });
            fetchPackages();
        }
    };

    const handleUpdate = async (id: string) => {
        const { error } = await supabase
            .from('internet_packages')
            .update(editForm)
            .eq('id', id);

        if (error) {
            showError('Gagal mengupdate paket');
        } else {
            showSuccess('Paket berhasil diupdate');
            setEditingId(null);
            fetchPackages();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus paket ini?')) return;

        const { error } = await supabase
            .from('internet_packages')
            .delete()
            .eq('id', id);

        if (error) {
            showError('Gagal menghapus paket');
        } else {
            showSuccess('Paket berhasil dihapus');
            fetchPackages();
        }
    };

    const startEdit = (pkg: InternetPackage) => {
        setEditingId(pkg.id);
        setEditForm(pkg);
    };

    const formatCurrency = (amount: number) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manajemen Paket Internet</CardTitle>
                <Button onClick={() => setIsAdding(true)} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Paket
                </Button>
            </CardHeader>
            <CardContent>
                {isAdding && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4">
                        <h3 className="font-semibold text-sm">Tambah Paket Baru</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Nama Paket</Label>
                                <Input
                                    value={newPackage.name}
                                    onChange={e => setNewPackage({ ...newPackage, name: e.target.value })}
                                    placeholder="Contoh: Paket Pelajar"
                                />
                            </div>
                            <div>
                                <Label>Kecepatan</Label>
                                <Input
                                    value={newPackage.speed}
                                    onChange={e => setNewPackage({ ...newPackage, speed: e.target.value })}
                                    placeholder="Contoh: 10 Mbps"
                                />
                            </div>
                            <div>
                                <Label>Harga (Rp)</Label>
                                <Input
                                    type="number"
                                    value={newPackage.price}
                                    onChange={e => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label>Deskripsi</Label>
                                <Input
                                    value={newPackage.description}
                                    onChange={e => setNewPackage({ ...newPackage, description: e.target.value })}
                                    placeholder="Keterangan singkat"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>Batal</Button>
                            <Button size="sm" onClick={handleAdd}>Simpan</Button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Paket</TableHead>
                                <TableHead>Kecepatan</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {packages.map((pkg) => (
                                <TableRow key={pkg.id}>
                                    <TableCell>
                                        {editingId === pkg.id ? (
                                            <Input
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                        ) : pkg.name}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === pkg.id ? (
                                            <Input
                                                value={editForm.speed}
                                                onChange={e => setEditForm({ ...editForm, speed: e.target.value })}
                                            />
                                        ) : pkg.speed}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === pkg.id ? (
                                            <Input
                                                type="number"
                                                value={editForm.price}
                                                onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                            />
                                        ) : formatCurrency(pkg.price)}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === pkg.id ? (
                                            <Input
                                                value={editForm.description}
                                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                            />
                                        ) : pkg.description}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editingId === pkg.id ? (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => handleUpdate(pkg.id)}>
                                                    <Save className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                    <X className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => startEdit(pkg)}>
                                                    <Edit className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(pkg.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {packages.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        Belum ada paket internet. Silakan tambah paket baru.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
