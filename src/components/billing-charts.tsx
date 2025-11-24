import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerBill } from "@/types/wifi-billing";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

interface BillingChartsProps {
  customers: CustomerBill[];
}

export function BillingCharts({ customers }: BillingChartsProps) {
  const chartData = useMemo(() => {
    // Generate data for the last 12 months
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

      // Filter customers for this month
      const monthCustomers = customers.filter(customer => {
        const customerDate = new Date(customer.created_at);
        return customerDate.getMonth() === date.getMonth() &&
          customerDate.getFullYear() === date.getFullYear();
      });

      const paidCustomers = monthCustomers.filter(c => c.status === 'paid');
      const unpaidCustomers = monthCustomers.filter(c => c.status === 'pending');

      const bayarTunai = paidCustomers.filter(c => c.paymentMethod === 'cash' || !c.paymentMethod).length;
      const bayarTransfer = paidCustomers.filter(c => c.paymentMethod === 'transfer').length;

      const totalPaidAmount = paidCustomers.reduce((sum, c) => sum + c.amount, 0);
      const totalUnpaidAmount = unpaidCustomers.reduce((sum, c) => sum + c.amount, 0);

      months.push({
        month: monthName,
        pelangganBayar: paidCustomers.length,
        pelangganBelumBayar: unpaidCustomers.length,
        bayarTunai,
        bayarTransfer,
        jumlahPembayaran: totalPaidAmount,
        tagihan: totalUnpaidAmount,
        totalPelanggan: monthCustomers.length
      });
    }

    return months;
  }, [customers]);

  const currentMonthData = chartData[chartData.length - 1];
  const previousMonthData = chartData[chartData.length - 2];

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const paymentTrend = getTrendPercentage(
    currentMonthData?.pelangganBayar || 0,
    previousMonthData?.pelangganBayar || 0
  );

  const unpaidTrend = getTrendPercentage(
    currentMonthData?.pelangganBelumBayar || 0,
    previousMonthData?.pelangganBelumBayar || 0
  );

  const revenueTrend = getTrendPercentage(
    currentMonthData?.jumlahPembayaran || 0,
    previousMonthData?.jumlahPembayaran || 0
  );

  // Pie chart data for current month
  const pieData = [
    {
      name: 'Sudah Bayar',
      value: currentMonthData?.pelangganBayar || 0,
      color: '#22c55e'
    },
    {
      name: 'Belum Bayar',
      value: currentMonthData?.pelangganBelumBayar || 0,
      color: '#ef4444'
    }
  ];

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggan Bayar Bulan Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{currentMonthData?.pelangganBayar || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${Number(paymentTrend) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(paymentTrend) >= 0 ? '+' : ''}{paymentTrend}%
              </span> dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggan Belum Bayar</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{currentMonthData?.pelangganBelumBayar || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${Number(unpaidTrend) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(unpaidTrend) >= 0 ? '+' : ''}{unpaidTrend}%
              </span> dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran Masuk Bulan Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(currentMonthData?.jumlahPembayaran || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={`${Number(revenueTrend) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(revenueTrend) >= 0 ? '+' : ''}{revenueTrend}%
              </span> dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan Aktif</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{currentMonthData?.totalPelanggan || 0}</div>
            <p className="text-xs text-muted-foreground">
              Bulan {currentMonthData?.month}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar Chart - Pelanggan Membayar vs Belum Bayar */}
        <Card>
          <CardHeader>
            <CardTitle>Grafik Bulanan: Pelanggan Bayar vs Belum Bayar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pelangganBayar" fill="#22c55e" name="Sudah Bayar" />
                <Bar dataKey="pelangganBelumBayar" fill="#ef4444" name="Belum Bayar" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Status Pembayaran Bulan Ini */}
        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Tunai', value: currentMonthData?.bayarTunai || 0, color: '#22c55e' },
                    { name: 'Transfer', value: currentMonthData?.bayarTransfer || 0, color: '#8b5cf6' },
                    { name: 'Belum Bayar', value: currentMonthData?.pelangganBelumBayar || 0, color: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Tunai', value: currentMonthData?.bayarTunai || 0, color: '#22c55e' },
                    { name: 'Transfer', value: currentMonthData?.bayarTransfer || 0, color: '#8b5cf6' },
                    { name: 'Belum Bayar', value: currentMonthData?.pelangganBelumBayar || 0, color: '#ef4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Trend Pembayaran */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Pembayaran Masuk (12 Bulan)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="jumlahPembayaran"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Pembayaran Masuk"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Tunggakan */}
        <Card>
          <CardHeader>
            <CardTitle>Grafik Bulanan: Tagihan Belum Terbayar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="tagihan" fill="#f59e0b" name="Tagihan Belum Terbayar" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

