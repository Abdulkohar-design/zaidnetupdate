import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerBill } from "@/types/wifi-billing";
import { Filter, CheckCircle, Clock, Database, Search, Calendar, DollarSign } from "lucide-react";

interface PaymentStatusFilterProps {
  customers: CustomerBill[];
  onFilterChange?: (filteredCustomers: CustomerBill[]) => void;
}

type FilterType = 'all' | 'paid' | 'transfer' | 'unpaid' | 'advanced';

export function PaymentStatusFilter({ customers, onFilterChange }: PaymentStatusFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerBill[]>(customers);

  // Advanced filter states
  const [searchName, setSearchName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [packageFilter, setPackageFilter] = useState('');

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const applyAdvancedFilter = () => {
    let filtered = customers;

    // Filter by name
    if (searchName.trim()) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter(c => {
        const customerDate = new Date(c.created_at);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (end) end.setHours(23, 59, 59, 999);

        if (start && end) {
          return customerDate >= start && customerDate <= end;
        } else if (start) {
          return customerDate >= start;
        } else if (end) {
          return customerDate <= end;
        }
        return true;
      });
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      filtered = filtered.filter(c => {
        const amount = c.amount;
        const min = minAmount ? parseFloat(minAmount) : null;
        const max = maxAmount ? parseFloat(maxAmount) : null;

        if (min !== null && max !== null) {
          return amount >= min && amount <= max;
        } else if (min !== null) {
          return amount >= min;
        } else if (max !== null) {
          return amount <= max;
        }
        return true;
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Filter by package
    if (packageFilter.trim()) {
      filtered = filtered.filter(c =>
        c.package_name?.toLowerCase().includes(packageFilter.toLowerCase())
      );
    }

    return filtered;
  };

  const handleFilter = (filterType: FilterType) => {
    let filtered: CustomerBill[];

    switch (filterType) {
      case 'all':
        filtered = customers;
        break;
      case 'paid':
        filtered = customers.filter(c => c.status === 'paid');
        break;
      case 'transfer':
        filtered = customers.filter(c => c.status === 'paid' && c.paymentMethod === 'transfer');
        break;
      case 'unpaid':
        filtered = customers.filter(c => c.status === 'pending');
        break;
      case 'advanced':
        filtered = applyAdvancedFilter();
        break;
      default:
        filtered = customers;
    }

    setActiveFilter(filterType);
    setFilteredCustomers(filtered);
    onFilterChange?.(filtered);
  };

  const handleAdvancedFilterApply = () => {
    const filtered = applyAdvancedFilter();
    setFilteredCustomers(filtered);
    onFilterChange?.(filtered);
  };

  const clearAdvancedFilters = () => {
    setSearchName('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setStatusFilter('all');
    setPackageFilter('');
  };

  const getStats = () => {
    const total = customers.length;
    const paid = customers.filter(c => c.status === 'paid').length;
    const transfer = customers.filter(c => c.status === 'paid' && c.paymentMethod === 'transfer').length;
    const unpaid = customers.filter(c => c.status === 'pending').length;
    const totalAmount = customers.reduce((sum, c) => sum + c.amount, 0);
    const paidAmount = customers.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
    const unpaidAmount = customers.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

    return { total, paid, transfer, unpaid, totalAmount, paidAmount, unpaidAmount };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Filter Status Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-5">
            <Button
              onClick={() => handleFilter('all')}
              className={`flex flex-col items-center gap-2 h-auto py-4 px-6 rounded-full font-semibold transition-all ${activeFilter === 'all'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg scale-105'
                : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{stats.total}</div>
                <div className="text-sm">Semua</div>
              </div>
            </Button>

            <Button
              onClick={() => handleFilter('paid')}
              className={`flex flex-col items-center gap-2 h-auto py-4 px-6 rounded-full font-semibold transition-all ${activeFilter === 'paid'
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg scale-105'
                : 'bg-green-100 hover:bg-green-200 text-green-800'
                }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{stats.paid}</div>
                <div className="text-sm">Lunas</div>
              </div>
            </Button>

            <Button
              onClick={() => handleFilter('transfer')}
              className={`flex flex-col items-center gap-2 h-auto py-4 px-6 rounded-full font-semibold transition-all ${activeFilter === 'transfer'
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg scale-105'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{stats.transfer}</div>
                <div className="text-sm">Transfer</div>
              </div>
            </Button>

            <Button
              onClick={() => handleFilter('unpaid')}
              className={`flex flex-col items-center gap-2 h-auto py-4 px-6 rounded-full font-semibold transition-all ${activeFilter === 'unpaid'
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105'
                : 'bg-red-100 hover:bg-red-200 text-red-800'
                }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{stats.unpaid}</div>
                <div className="text-sm">Belum Bayar</div>
              </div>
            </Button>

            <Button
              onClick={() => handleFilter('advanced')}
              className={`flex flex-col items-center gap-2 h-auto py-4 px-6 rounded-full font-semibold transition-all ${activeFilter === 'advanced'
                ? 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
            >
              <Filter className="h-2 w-2 mb-1" />
              <div className="text-center">
                <div className="text-sm">Filter Lanjut</div>
              </div>
            </Button>
          </div>

          <div className="flex gap-4 justify-center">
            <Badge variant="outline">
              Total Data: {filteredCustomers.length}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              Total Nominal: {formatCurrency(filteredCustomers.reduce((sum, c) => sum + c.amount, 0))}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {activeFilter === 'advanced' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Lanjutan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="searchName" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Nama Pelanggan
                </Label>
                <Input
                  id="searchName"
                  placeholder="Cari nama pelanggan..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="packageFilter">Paket Internet</Label>
                <Input
                  id="packageFilter"
                  placeholder="Cari paket..."
                  value={packageFilter}
                  onChange={(e) => setPackageFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tanggal Mulai
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Tanggal Akhir</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="statusFilter">Status</Label>
                <Select value={statusFilter} onValueChange={(value: 'all' | 'paid' | 'pending') => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="paid">Lunas</SelectItem>
                    <SelectItem value="pending">Belum Bayar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="minAmount" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Nominal Minimum
                </Label>
                <Input
                  id="minAmount"
                  type="number"
                  placeholder="0"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="maxAmount">Nominal Maksimum</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  placeholder="Tidak terbatas"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={clearAdvancedFilters}>
                Bersihkan Filter
              </Button>
              <Button onClick={handleAdvancedFilterApply}>
                <Filter className="h-4 w-4 mr-2" />
                Terapkan Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}