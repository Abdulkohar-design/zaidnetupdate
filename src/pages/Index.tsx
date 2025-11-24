import { useState, useEffect } from "react";
import { LogOut, Users, Settings, Key } from "lucide-react"; // ✅ Tambahkan 'Key' icon
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { BillingStatsComponent } from "@/components/billing-stats";
import { CustomerList } from "@/components/customer-list";
import { NameEditModal } from "@/components/name-edit-modal";
import { PasswordEditModal } from "@/components/password-edit-modal"; // ✅ Import komponen baru
import { BillingExport } from "@/components/billing-export";
import { FeatureInfo } from "@/components/feature-info";
import { InternetPackageSettings } from "@/components/internet-package-settings";
import { PaymentHistoryView } from "@/components/payment-history-view";
import { PaymentFilter } from "@/components/payment-filter";
import { PaymentStatusFilter } from "@/components/payment-status-filter";
import { BillingCharts } from "@/components/billing-charts";
import { OverdueBills } from "@/components/overdue-bills";
import { UserManagement } from "@/components/user-management";
import { CustomerMap } from "@/components/customer-map";
import { BillingTemplateEditor } from "@/components/billing-template-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CustomerBill, BillingStats } from "@/types/wifi-billing";
import { useUser } from '../App';
import { supabase } from '../integrations/supabase/client';
import { Navigate } from "react-router-dom";

function Index() {
  const { user, isLoading, logout } = useUser();
  const [employeeName, setEmployeeName] = useState("Memuat Nama...");
  const [isNameEditModalOpen, setIsNameEditModalOpen] = useState(false);
  const [isPasswordEditModalOpen, setIsPasswordEditModalOpen] = useState(false); // ✅ State baru untuk modal password
  const [customers, setCustomers] = useState<CustomerBill[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerBill[]>([]);
  const [stats, setStats] = useState<BillingStats>({
    totalCustomers: 0,
    totalPending: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    totalPaidAmount: 0,
    totalRevenue: 0,
  });
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState("customer_bills");

  const { toast } = useToast();

  const loggedInUserRole = user?.role || "pegawai";
  const employeeSpecificTable = user?.employee_tagihan_table_name;

  const allAvailableTables = [
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

  useEffect(() => {
    if (user) {
      setEmployeeName(user.full_name || "Pegawai Zaid Net");
      // Untuk pegawai, jangan pernah setCurrentTable. Pakai table tetap!
      if (user.role === 'admin' && !allAvailableTables.includes(currentTable)) {
        setCurrentTable(allAvailableTables[0] || 'customer_bills');
      }
    }
    // Fetch data kalau user ready
    if (!isLoading && user) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [user, isLoading, currentTable, employeeSpecificTable]); // Dependensi tetap, supaya admin bisa ganti tabel

  // Penentuan nama tabel
  const tableNameToQuery =
    loggedInUserRole === 'admin'
      ? currentTable
      : employeeSpecificTable;

  const fetchData = async () => {
    if (!tableNameToQuery) {
      toast({
        title: "Error",
        description: "Nama tabel tidak ditemukan atau tidak dikonfigurasi.",
        variant: "destructive"
      });
      return;
    }
    try {
      const { data, error } = await supabase
        .from(tableNameToQuery)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Gagal memuat data pelanggan.",
          variant: "destructive"
        });
        return;
      }
      const customersData: CustomerBill[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        amount: Number(item.amount),
        status: item.status as 'paid' | 'pending',
        paymentMethod: item.paymentMethod || 'cash', // Default to cash for old data
        created_at: item.created_at,
        notes: item.notes || '',
        due_date: item.due_date,
        // Field baru - safe handling untuk data lama
        phone_number: item.phone_number || '',
        address: item.address || '',
        package_name: item.package_name || '',
        latitude: item.latitude || undefined,
        longitude: item.longitude || undefined,
        photo_url: item.photo_url || '',
      }));
      setCustomers(customersData);
      setFilteredCustomers(customersData);

      // Statistik
      const totalCustomers = customersData.length;
      const totalPending = customersData.filter(c => c.status === 'pending').length;
      const totalPaid = customersData.filter(c => c.status === 'paid').length;
      const totalUnpaid = customersData
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + Number(c.amount), 0);
      const totalPaidAmount = customersData
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + Number(c.amount), 0);
      const totalRevenue = customersData.reduce((sum, c) => sum + Number(c.amount), 0);

      setStats({
        totalCustomers,
        totalPending,
        totalPaid,
        totalUnpaid,
        totalPaidAmount,
        totalRevenue,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat memuat data.",
        variant: "destructive"
      });
    }
  };

  // Semua operasi lain tetap. Pastikan pakai tableNameToQuery juga.
  const handleUpdateCustomer = async (id: string, customer: Partial<CustomerBill>) => {
    try {
      const { error } = await supabase
        .from(tableNameToQuery)
        .update(customer)
        .eq('id', id);
      if (error) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      } else {
        fetchData();
        toast({ title: "Sukses", description: "Pelanggan berhasil diperbarui." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Terjadi kesalahan saat memperbarui." });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableNameToQuery)
        .delete()
        .eq('id', id);
      if (error) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      } else {
        fetchData();
        toast({ title: "Sukses", description: "Pelanggan berhasil dihapus." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Terjadi kesalahan saat menghapus." });
    }
  };

  const handleAddCustomer = async (customer: Omit<CustomerBill, 'id' | 'created_at' | 'due_date'>) => {
    if (!user) {
      toast({ title: "Error", description: "Anda harus login untuk menambah pelanggan.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase
        .from(tableNameToQuery)
        .insert({
          id: crypto.randomUUID(),
          name: customer.name,
          amount: customer.amount,
          status: customer.status,
          notes: customer.notes || null,
          // Field baru - insert null jika kosong untuk kompatibilitas
          phone_number: customer.phone_number || null,
          address: customer.address || null,
          package_name: customer.package_name || null,
          latitude: customer.latitude || null,
          longitude: customer.longitude || null,
          photo_url: customer.photo_url || null,
          user_id: user.id,
          created_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
      if (error) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      } else {
        fetchData();
        toast({ title: "Sukses", description: "Pelanggan berhasil ditambahkan." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Terjadi kesalahan saat menambahkan." });
    }
  };

  const handleImportCustomers = async (newCustomers: Omit<CustomerBill, 'id' | 'created_at' | 'due_date'>[]) => {
    if (!user) {
      toast({ title: "Error", description: "Anda harus login untuk mengimpor pelanggan.", variant: "destructive" });
      return;
    }
    const customersToInsert = newCustomers.map(c => ({
      id: crypto.randomUUID(),
      name: c.name,
      amount: c.amount,
      status: c.status,
      notes: c.notes || null,
      // Field baru - safe handling untuk import
      phone_number: c.phone_number || null,
      address: c.address || null,
      package_name: c.package_name || null,
      latitude: c.latitude || null,
      longitude: c.longitude || null,
      photo_url: c.photo_url || null,
      user_id: user.id,
      created_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));
    try {
      const { error } = await supabase
        .from(tableNameToQuery)
        .insert(customersToInsert);
      if (error) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      } else {
        fetchData();
        toast({ title: "Sukses", description: `${newCustomers.length} pelanggan berhasil diimpor.` });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Terjadi kesalahan saat mengimpor." });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCustomerIds.length === 0) return;
    try {
      const { error } = await supabase
        .from(tableNameToQuery)
        .delete()
        .in('id', selectedCustomerIds);
      if (error) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      } else {
        setSelectedCustomerIds([]);
        fetchData();
        toast({ title: "Sukses", description: `${selectedCustomerIds.length} pelanggan berhasil dihapus.` });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Terjadi kesalahan saat menghapus pelanggan terpilih." });
    }
  };

  const handleFilterChange = (filtered: CustomerBill[]) => {
    setFilteredCustomers(filtered);
  };

  const handleSaveEmployeeName = async (newName: string) => {
    if (!user) {
      toast({ title: "Error", description: "Profil tidak ditemukan.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: newName })
        .eq('id', user.id);
      if (error) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Nama Diperbarui", description: "Nama pegawai berhasil diperbarui." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Terjadi kesalahan saat memperbarui nama." });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-center flex items-center justify-center text-xl">
      Memuat data...
    </div>;
  }

  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold">ZaidNet - WiFi Billing System</h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Aplikasi berbasis web bisa Online dan Offline - Sistem Manajemen Tagihan Internet</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto text-sm">
                <Users className="h-4 w-4" />
                <span className="truncate">{employeeName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsNameEditModalOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Edit Nama
              </DropdownMenuItem>
              {/* ✅ Tambahkan item menu "Ganti Password" di sini */}
              <DropdownMenuItem onClick={() => setIsPasswordEditModalOpen(true)}>
                <Key className="mr-2 h-4 w-4" /> {/* Icon 'Key' */}
                Ganti Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown tabel HANYA untuk admin */}
          {loggedInUserRole === 'admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto text-sm">
                  <span className="hidden sm:inline">Tabel:</span>
                  <span className="truncate">{currentTable}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Pilih Tabel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allAvailableTables.map(tableName => (
                  <DropdownMenuItem key={tableName} onClick={() => setCurrentTable(tableName)}>
                    {tableName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <BillingExport customers={customers} stats={stats} employeeName={employeeName} />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-2 sm:p-4">
        <FeatureInfo />

        <Tabs defaultValue="dashboard" className="mt-4 sm:mt-6">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-10 gap-1 sm:gap-2 h-auto">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2">Dashboard</TabsTrigger>
            <TabsTrigger value="customers" className="text-xs sm:text-sm py-2">Data Pelanggan</TabsTrigger>
            <TabsTrigger value="packages" className="text-xs sm:text-sm py-2">Paket Internet</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs sm:text-sm py-2">Pembayaran</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm py-2">Riwayat</TabsTrigger>
            <TabsTrigger value="charts" className="text-xs sm:text-sm py-2">Grafik</TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs sm:text-sm py-2">Tunggakan</TabsTrigger>
            <TabsTrigger value="map" className="text-xs sm:text-sm py-2">Map</TabsTrigger>
            <TabsTrigger value="template" className="text-xs sm:text-sm py-2">Template</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2">Setting</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 mt-4">
            <BillingStatsComponent stats={stats} />
            <Separator className="my-4" />
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Ringkasan Pelanggan Terbaru</h3>
              <CustomerList
                customers={customers.slice(0, 5)} // Show only 5 recent customers
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onAddCustomer={handleAddCustomer}
                onImportCustomers={handleImportCustomers}
                selectedIds={selectedCustomerIds}
                setSelectedIds={setSelectedCustomerIds}
                onDeleteSelected={handleDeleteSelected}
              />
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4 mt-4">
            <PaymentStatusFilter customers={customers} onFilterChange={handleFilterChange} />
            <CustomerList
              customers={filteredCustomers}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onAddCustomer={handleAddCustomer}
              onImportCustomers={handleImportCustomers}
              selectedIds={selectedCustomerIds}
              setSelectedIds={setSelectedCustomerIds}
              onDeleteSelected={handleDeleteSelected}
            />
          </TabsContent>

          <TabsContent value="packages" className="space-y-4 mt-4">
            <InternetPackageSettings />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4 mt-4">
            <PaymentFilter customers={customers} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <PaymentHistoryView />
          </TabsContent>

          <TabsContent value="charts" className="space-y-4 mt-4">
            <BillingCharts customers={customers} />
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4 mt-4">
            <OverdueBills customers={customers} />
          </TabsContent>

          <TabsContent value="map" className="space-y-4 mt-4">
            <CustomerMap customers={customers} />
          </TabsContent>

          <TabsContent value="template" className="space-y-4 mt-4">
            <BillingTemplateEditor />
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-4">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
      <MadeWithDyad />

      <NameEditModal
        isOpen={isNameEditModalOpen}
        onClose={() => setIsNameEditModalOpen(false)}
        currentName={employeeName}
        onSave={handleSaveEmployeeName}
      />

      {/* ✅ Render komponen PasswordEditModal di sini */}
      <PasswordEditModal
        isOpen={isPasswordEditModalOpen}
        onClose={() => setIsPasswordEditModalOpen(false)}
      />
    </div>
  );
}

export default Index;
