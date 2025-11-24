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

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Bukti Pembayaran - ${customer.name}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 400px; 
            margin: 0 auto; 
            padding: 20px;
            font-size: 12px;
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #000; 
            padding-bottom: 10px; 
            margin-bottom: 15px;
        }
        .title { font-size: 16px; font-weight: bold; }
        .subtitle { font-size: 10px; margin-top: 5px; }
        .content { margin: 15px 0; }
        .row { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0;
            padding: 3px 0;
        }
        .row.total { 
            border-top: 1px solid #000; 
            border-bottom: 1px solid #000;
            font-weight: bold;
            margin-top: 15px;
            padding: 8px 0;
        }
        .status-paid { 
            background: #d4edda; 
            color: #155724; 
            padding: 5px; 
            text-align: center; 
            border-radius: 3px;
            font-weight: bold;
        }
        .status-pending { 
            background: #f8d7da; 
            color: #721c24; 
            padding: 5px; 
            text-align: center; 
            border-radius: 3px;
            font-weight: bold;
        }
        .footer { 
            text-align: center; 
            margin-top: 20px; 
            border-top: 1px solid #000; 
            padding-top: 10px;
            font-size: 10px;
        }
        @media print {
            body { margin: 0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">ZAIDNET</div>
        <div class="subtitle">Layanan Internet Hotspot & PPPoE</div>
        <div class="subtitle">Bukti Pembayaran Tagihan</div>
    </div>
    
    <div class="content">
        <div class="row">
            <span>No. Tagihan:</span>
            <span>#${customer.id.slice(-8).toUpperCase()}</span>
        </div>
        <div class="row">
            <span>Nama Pelanggan:</span>
            <span>${customer.name}</span>
        </div>
        <div class="row">
            <span>Paket Internet:</span>
                            <span>${customer.package_name || 'Paket Internet'}</span>
        </div>
        <div class="row">
            <span>Alamat:</span>
            <span>${customer.address || '-'}</span>
        </div>
        <div class="row">
            <span>Telepon:</span>
                            <span>${customer.phone_number || '-'}</span>
        </div>
        <div class="row">
            <span>Tanggal Jatuh Tempo:</span>
            <span>${formatDate(customer.due_date)}</span>
        </div>
        <div class="row">
            <span>Tanggal Cetak:</span>
            <span>${now}</span>
        </div>
        
        <div class="row total">
            <span>Total Tagihan:</span>
            <span>${formatCurrency(customer.amount)}</span>
        </div>
        
        <div style="margin: 15px 0;">
            <div class="${customer.status === 'paid' ? 'status-paid' : 'status-pending'}">
                ${customer.status === 'paid' ? '✓ LUNAS' : '⚠ BELUM LUNAS'}
            </div>
        </div>
        
        ${customer.notes ? `
        <div class="row">
            <span>Catatan:</span>
            <span>${customer.notes}</span>
        </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <div>Terima kasih atas kepercayaan Anda</div>
        <div>ZaidNet - Connecting You to the World</div>
        <div style="margin-top: 10px;">
            Customer Service: [Nomor CS] | Website: zaidnet.com
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
