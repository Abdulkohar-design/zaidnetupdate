import { useState } from "react";
import { Calendar, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CustomerBill } from "@/types/wifi-billing";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

interface PaymentFilterProps {
  customers: CustomerBill[];
}

export function PaymentFilter({ customers }: PaymentFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<CustomerBill[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

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

  const handleFilter = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Tanggal Tidak Lengkap",
        description: "Mohon isi tanggal mulai dan tanggal akhir",
        variant: "destructive"
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date

    // Filter only paid customers within date range
    const filtered = customers.filter(customer => {
      if (customer.status !== 'paid') return false;
      
      const customerDate = new Date(customer.created_at);
      return customerDate >= start && customerDate <= end;
    });

    setFilteredPayments(filtered);
    setShowResults(true);

    toast({
      title: "Filter Diterapkan",
      description: `Ditemukan ${filtered.length} pembayaran dalam rentang tanggal tersebut`,
    });
  };

  const handleExportExcel = () => {
    if (filteredPayments.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data pembayaran untuk diekspor",
        variant: "destructive"
      });
      return;
    }

    const exportData = filteredPayments.map((payment, index) => ({
      'No': index + 1,
      'Nama Pelanggan': payment.name,
              'Paket Internet': payment.package_name || '-',
      'Nominal': payment.amount,
              'Tanggal Bayar': formatDate(payment.created_at),
              'Jatuh Tempo': formatDate(payment.due_date),
              'No. WhatsApp': payment.phone_number || '-',
      'Alamat': payment.address || '-',
      'Catatan': payment.notes || '-'
    }));

    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Add summary row
    exportData.push({
      'No': '',
      'Nama Pelanggan': 'TOTAL PEMBAYARAN',
      'Paket Internet': '',
      'Nominal': totalAmount,
      'Tanggal Bayar': '',
      'Jatuh Tempo': '',
      'No. WhatsApp': '',
      'Alamat': '',
      'Catatan': ''
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pembayaran Masuk');

    const fileName = `Pembayaran_Masuk_${startDate}_to_${endDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Export Berhasil",
      description: `Data pembayaran berhasil diekspor ke ${fileName}`,
    });
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter Pembayaran Masuk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="startDate">Tanggal Mulai</Label>
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
            <div className="flex items-end gap-2">
              <Button onClick={handleFilter} className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {showResults && filteredPayments.length > 0 && (
                <Button variant="outline" onClick={handleExportExcel}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Filter Pembayaran</CardTitle>
            <div className="flex gap-4">
              <Badge variant="outline">
                {filteredPayments.length} Pembayaran
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                Total: {formatCurrency(totalAmount)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Tidak ada pembayaran dalam rentang tanggal tersebut
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Nama Pelanggan</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Paket</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Nominal</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Tanggal Bayar</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment, index) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">{payment.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{payment.package_name || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium text-green-600">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{formatDate(payment.created_at)}</td>
                        <td className="border border-gray-300 px-4 py-2">{payment.phone_number || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">
                        TOTAL:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-green-600">
                        {formatCurrency(totalAmount)}
                      </td>
                      <td colSpan={2} className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
