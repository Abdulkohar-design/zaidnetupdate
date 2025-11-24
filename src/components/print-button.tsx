import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerBill } from "@/types/wifi-billing";
import { useToast } from "@/components/ui/use-toast";

interface PrintButtonProps {
  customer: CustomerBill;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function PrintButton({ customer, variant = "outline", size = "sm" }: PrintButtonProps) {
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

  const generatePrintContent = () => {
    const now = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const paymentMethodText = customer.status === 'paid'
      ? (customer.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Tunai')
      : '-';

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Kwitansi - ${customer.name}</title>
    <style>
        body { 
            font-family: 'Courier New', Courier, monospace; 
            max-width: 300px; 
            margin: 0 auto; 
            padding: 10px;
            font-size: 12px;
            background-color: #fff;
        }
        .container {
            border: 1px solid #ddd;
            padding: 15px;
        }
        .header { 
            text-align: center; 
            border-bottom: 2px dashed #000; 
            padding-bottom: 10px; 
            margin-bottom: 15px;
        }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .subtitle { font-size: 11px; color: #555; }
        .content { margin: 15px 0; }
        .row { 
            display: flex; 
            justify-content: space-between; 
            margin: 5px 0;
        }
        .label { color: #555; }
        .value { font-weight: bold; text-align: right; }
        .divider { 
            border-top: 1px dashed #000; 
            margin: 10px 0; 
        }
        .total-section { 
            margin-top: 10px;
            font-size: 14px;
        }
        .status-stamp { 
            text-align: center;
            margin: 20px 0;
            border: 2px solid #000;
            padding: 10px;
            transform: rotate(-5deg);
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
            border-radius: 5px;
        }
        .paid { border-color: #28a745; color: #28a745; }
        .pending { border-color: #dc3545; color: #dc3545; }
        
        .footer { 
            text-align: center; 
            margin-top: 20px; 
            font-size: 10px;
            color: #777;
            border-top: 1px dashed #000;
            padding-top: 10px;
        }
        @media print {
            body { margin: 0; padding: 0; }
            .container { border: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">ZAIDNET</div>
            <div class="subtitle">Internet Service Provider</div>
            <div class="subtitle">Jalan Raya Simpang No. 123</div>
            <div class="subtitle">WA: 0812-3456-7890</div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 15px; font-weight: bold;">
                BUKTI PEMBAYARAN
            </div>
            
            <div class="row">
                <span class="label">Tanggal:</span>
                <span class="value">${now}</span>
            </div>
            <div class="row">
                <span class="label">No. Ref:</span>
                <span class="value">INV-${customer.id.slice(0, 8).toUpperCase()}</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="row">
                <span class="label">Pelanggan:</span>
                <span class="value">${customer.name}</span>
            </div>
            <div class="row">
                <span class="label">ID Pelanggan:</span>
                <span class="value">${customer.id.slice(-6).toUpperCase()}</span>
            </div>
            <div class="row">
                <span class="label">Paket:</span>
                <span class="value">${customer.package_name || 'Internet Paket'}</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="row total-section">
                <span class="label">TOTAL TAGIHAN:</span>
                <span class="value">${formatCurrency(customer.amount)}</span>
            </div>
            
            <div class="row">
                <span class="label">Metode Bayar:</span>
                <span class="value">${paymentMethodText}</span>
            </div>
            
            <div style="text-align: center;">
                <div class="status-stamp ${customer.status === 'paid' ? 'paid' : 'pending'}">
                    ${customer.status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
                </div>
            </div>
            
            ${customer.notes ? `
            <div class="row">
                <span class="label">Catatan:</span>
                <span class="value" style="font-size: 10px;">${customer.notes}</span>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <div>Terima kasih atas pembayaran Anda.</div>
            <div>Simpan struk ini sebagai bukti pembayaran yang sah.</div>
            <div style="margin-top: 5px;">Powered by ZaidNet System</div>
        </div>
    </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const printContent = generatePrintContent();
    const printWindow = window.open('', '_blank', 'width=400,height=600');

    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Tunggu konten dimuat lalu print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };

      toast({
        title: "Bukti Pembayaran Disiapkan",
        description: `Dokumen untuk ${customer.name} siap dicetak.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Gagal membuka jendela print. Pastikan popup blocker tidak aktif.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className="gap-1"
      title={`Cetak bukti pembayaran untuk ${customer.name}`}
    >
      <Printer className="h-4 w-4" />
      {size !== "sm" && "Print"}
    </Button>
  );
}
