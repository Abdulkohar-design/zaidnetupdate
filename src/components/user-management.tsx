import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, Shield, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { useUser } from '../App';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useUser();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@zaidnet.com',
        full_name: 'Administrator ZaidNet',
        role: 'admin',
        isActive: true,
        created_at: new Date('2024-01-01'),
        lastLogin: new Date(),
      },
      {
        id: '2',
        email: 'pegawai1@zaidnet.com',
        full_name: 'Pegawai Wilayah Utara',
        role: 'pegawai',
        employee_tagihan_table_name: 'tagihan_adede',
        isActive: true,
        created_at: new Date('2024-02-01'),
        lastLogin: new Date('2024-11-15'),
      },
      {
        id: '3',
        email: 'pegawai2@zaidnet.com',
        full_name: 'Pegawai Wilayah Selatan',
        role: 'pegawai',
        employee_tagihan_table_name: 'tagihan_basit',
        isActive: false,
        created_at: new Date('2024-03-01'),
        lastLogin: new Date('2024-10-20'),
      },
    ];
    setUsers(mockUsers);
  }, []);

  const availableTables = [
    'customer_bills',
    'tagihan_adede',
    'tagihan_basit',
    'tagihan_bodong',
    'tagihan_datuk',
    'tagihan_juig_karang',
    'tagihan_juig_leuwisari',
    'tagihan_juig_simpang',
    'tagihan_jumbo',
    'tagihan_leuwilisung',
    'tagihan_novi_cisela',
    'tagihan_rompang',
    'tagihan_yeyen',
    'tagihan_yono',
    'tagihan_nia',
    'tagihan_rompang_sarakan',
  ];

  const handleAddUser = (userData: Omit<User, 'id' | 'created_at'>) => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      created_at: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
    toast({
      title: "User Ditambahkan",
      description: `User ${userData.full_name} berhasil ditambahkan.`,
    });
  };

  const handleEditUser = (userData: User) => {
    setUsers(prev => prev.map(user => 
      user.id === userData.id ? userData : user
    ));
    toast({
      title: "User Diperbarui",
      description: `User ${userData.full_name} berhasil diperbarui.`,
    });
  };

  const handleDeleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.id === currentUser?.id) {
      toast({
        title: "Error",
        description: "Anda tidak dapat menghapus akun Anda sendiri.",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus user ${user?.full_name}?`)) {
      setUsers(prev => prev.filter(user => user.id !== id));
      toast({
        title: "User Dihapus",
        description: `User ${user?.full_name} berhasil dihapus.`,
      });
    }
  };

  const handleToggleActive = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.id === currentUser?.id) {
      toast({
        title: "Error",
        description: "Anda tidak dapat menonaktifkan akun Anda sendiri.",
        variant: "destructive"
      });
      return;
    }

    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const activeUsers = users.filter(u => u.isActive);
  const adminUsers = users.filter(u => u.role === 'admin');
  const employeeUsers = users.filter(u => u.role === 'pegawai');

  // Only admins can manage users
  if (currentUser?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Akses Terbatas</h3>
          <p className="text-muted-foreground">
            Hanya administrator yang dapat mengakses manajemen user.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adminUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{employeeUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen User</h2>
          <p className="text-sm text-muted-foreground">Kelola pengguna sistem billing</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
            </DialogHeader>
            <UserForm 
              onSubmit={handleAddUser} 
              onCancel={() => setIsAddModalOpen(false)}
              availableTables={availableTables}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className={`${!user.isActive ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.role === 'admin' ? (
                      <Shield className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Users className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.employee_tagihan_table_name && (
                      <p className="text-xs text-blue-600 mt-1">
                        Tabel: {user.employee_tagihan_table_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Administrator' : 'Pegawai'}
                    </Badge>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dibuat: {formatDate(user.created_at)}
                    </p>
                    {user.lastLogin && (
                      <p className="text-xs text-muted-foreground">
                        Login: {formatDate(user.lastLogin)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => handleToggleActive(user.id)}
                        disabled={user.id === currentUser?.id}
                      />
                      <Label className="text-sm">
                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                      </Label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={user.id === currentUser?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <UserForm 
              initialData={editingUser}
              onSubmit={(data) => {
                handleEditUser({ ...data, id: editingUser.id, created_at: editingUser.created_at } as User);
                setIsEditModalOpen(false);
                setEditingUser(null);
              }} 
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingUser(null);
              }}
              availableTables={availableTables}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: Omit<User, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  availableTables: string[];
}

function UserForm({ initialData, onSubmit, onCancel, availableTables }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    full_name: initialData?.full_name || '',
    role: initialData?.role || 'pegawai' as 'admin' | 'pegawai',
    employee_tagihan_table_name: initialData?.employee_tagihan_table_name || '',
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="user@zaidnet.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="full_name">Nama Lengkap</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Nama lengkap pengguna"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'pegawai' })}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="pegawai">Pegawai</option>
          <option value="admin">Administrator</option>
        </select>
      </div>
      
      {formData.role === 'pegawai' && (
        <div>
          <Label htmlFor="table">Tabel Tagihan</Label>
          <select
            id="table"
            value={formData.employee_tagihan_table_name}
            onChange={(e) => setFormData({ ...formData, employee_tagihan_table_name: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Pilih Tabel</option>
            {availableTables.map(table => (
              <option key={table} value={table}>{table}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label>User Aktif</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Tambah'} User
        </Button>
      </div>
    </form>
  );
}

