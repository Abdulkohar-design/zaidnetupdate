import { useState, useMemo } from "react";
import { AlertTriangle, Download, Calendar, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomerBill } from "@/types/wifi-billing";
import { WhatsAppButton } from "./whatsapp-button";
import { PrintButton } from "./print-button";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

interface OverdueBillsProps {
  customers: CustomerBill[];
}

export function OverdueBills({ customers }: OverdueBillsProps) {
  const { toast } = useToast();

  const overdueData = useMemo(() => {
    const now = new Date();
    
    // Filter customers yang belum bayar dan sudah lewat jatuh tempo
    const overdueCustomers = customers.filter(customer => {
      if (customer.status !== 'pending') return false;
      
      const dueDate = new Date(customer.due_date);
      return dueDate < now;
    });

    // Kategorikan berdasarkan lama keterlambatan
    const categories = {
      '1-7 hari': [],
      '8-30 hari': [],
      '31-60 hari': [],
      '> 60 hari': []
    };

    overdueCustomers.forEach(customer => {
      const dueDate = new Date(customer.due_date);
      const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) {
        categories['1-7 hari'].push({ ...customer, daysDiff });
      } else if (daysDiff <= 30) {
        categories['8-30 hari'].push({ ...customer, daysDiff });
      } else if (daysDiff <= 60) {
        categories['31-60 hari'].push({ ...customer, daysDiff });
      } else {
        categories['> 60 hari'].push({ ...customer, daysDiff });
      }
    });

    return {
      categories,
      totalOverdue: overdueCustomers.length,
      totalAmount: overdueCustomers.reduce((sum, customer) => sum + customer.amount, 0),
      allOverdue: overdueCustomers.map(customer => {
        const dueDate = new Date(customer.due_date);
        const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return { ...customer, daysDiff };
      })
    };
  }, [customers]);

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '1-7 hari': return 'bg-yellow-100 text-yellow-800';
      case '8-30 hari': return 'bg-orange-100 text-orange-800';
      case '31-60 hari': return 'bg-red-100 text-red-800';
      case '> 60 hari': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportOverdue = () => {
    if (overdueData.allOverdue.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data tunggakan untuk diekspor",
        variant: "destructive"
      });
      return;
    }

    const exportData = overdueData.allOverdue.map((customer, index) => ({
      'No': index + 1,
      'Nama Pelanggan': customer.name,
              'Paket Internet': customer.package_name || '-',
      'Nominal': customer.amount,
      'Jatuh Tempo': formatDate(customer.due_date),
      'Hari Terlambat': customer.daysDiff,
              'No. WhatsApp': customer.phone_number || '-',
      'Alamat': customer.address || '-',
      'Catatan': customer.notes || '-'
    }));

    // Add summary
    exportData.push({
      'No': '',
      'Nama Pelanggan': 'TOTAL TUNGGAKAN',
      'Paket Internet': '',
      'Nominal': overdueData.totalAmount,
      'Jatuh Tempo': '',
      'Hari Terlambat': '',
      'No. WhatsApp': '',
      'Alamat': '',
      'Catatan': ''
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Tunggakan');

    const fileName = `Data_Tunggakan_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Export Berhasil",
      description: `Data tunggakan berhasil diekspor ke ${fileName}`,
    });
  };

  const handleBulkWhatsApp = (customers: any[]) => {
    customers.forEach((customer, index) => {
      setTimeout(() => {
        if (customer.phone_number) {
          const message = `🚨 *REMINDER TAGIHAN TERLAMBAT*

👤 *Nama:* ${customer.name}
      📦 *Paket:* ${customer.package_name || 'Paket Internet'}
💰 *Nominal:* ${formatCurrency(customer.amount)}
📅 *Jatuh Tempo:* ${formatDate(customer.due_date)}
⏰ *Terlambat:* ${customer.daysDiff} hari

⚠️ *PEMBERITAHUAN PENTING*
Tagihan Anda sudah melewati batas jatuh tempo. Mohon segera lakukan pembayaran untuk menghindari gangguan layanan.

💳 *Cara Pembayaran:*
- Transfer Bank
- Bayar Tunai ke Teknisi

📞 *Kontak:* Segera hubungi kami untuk konfirmasi pembayaran

---
*ZaidNet - Layanan Internet Terpercaya*`;

          const formattedPhone = customer.phone_number.replace(/\D/g, '');
          const phone = formattedPhone.startsWith('0') ? '62' + formattedPhone.slice(1) : formattedPhone;
          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        }
      }, index * 1000); // Delay 1 detik antar pesan
    });

    toast({
      title: "WhatsApp Bulk Reminder",
              description: `Mengirim reminder ke ${customers.filter(c => c.phone_number).length} pelanggan`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan Tunggakan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueData.totalOverdue}</div>
            <p className="text-xs text-muted-foreground">
              Dari {customers.length} total pelanggan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai Tunggakan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(overdueData.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tagihan yang belum terbayar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export & Reminder</CardTitle>
            <Download className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={handleExportOverdue} variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button 
              onClick={() => handleBulkWhatsApp(overdueData.allOverdue)} 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled={overdueData.allOverdue.filter(c => c.phone_number).length === 0}
            >
              <Phone className="h-4 w-4 mr-2" />
              Bulk WA Reminder
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(overdueData.categories).map(([category, customers]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Terlambat {category}</span>
                <Badge className={getCategoryColor(category)}>
                  {customers.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {formatCurrency(customers.reduce((sum, c) => sum + c.amount, 0))}
              </div>
              {customers.length > 0 && (
                <div className="mt-2">
                  <Button 
                    onClick={() => handleBulkWhatsApp(customers)} 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    disabled={customers.filter(c => c.phone_number).length === 0}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Reminder ({customers.filter(c => c.phone_number).length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Table */}
      {overdueData.allOverdue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detail Data Tunggakan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Paket</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nominal</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Jatuh Tempo</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Terlambat</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueData.allOverdue.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{customer.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{customer.package_name || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium text-red-600">
                        {formatCurrency(customer.amount)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{formatDate(customer.due_date)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge className={getCategoryColor(
                          customer.daysDiff <= 7 ? '1-7 hari' : 
                          customer.daysDiff <= 30 ? '8-30 hari' : 
                          customer.daysDiff <= 60 ? '31-60 hari' : '> 60 hari'
                        )}>
                          {customer.daysDiff} hari
                        </Badge>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-1">
                          <WhatsAppButton customer={customer} />
                          <PrintButton customer={customer} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {overdueData.allOverdue.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">Tidak Ada Tunggakan!</h3>
            <p className="text-muted-foreground">
              Semua pelanggan telah membayar tagihan mereka tepat waktu.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

