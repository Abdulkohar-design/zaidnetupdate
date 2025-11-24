import { BillingStats } from "@/types/wifi-billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

interface BillingStatsProps {
  stats: BillingStats;
}

export function BillingStatsComponent({ stats }: BillingStatsProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Pelanggan</CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{stats.totalCustomers}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Belum Bayar</CardTitle>
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-orange-600">Rp {stats.totalUnpaid.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Sudah Dibayar</CardTitle>
          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-green-600">Rp {stats.totalPaidAmount.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Keseluruhan</CardTitle>
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-blue-600">Rp {stats.totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}