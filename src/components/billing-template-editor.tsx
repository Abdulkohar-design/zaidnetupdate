import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Save, RotateCcw, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CustomerBill } from "@/types/wifi-billing";

interface BillingTemplate {
  title: string;
  reminderText: string;
  paymentMethods: string;
  contactInfo: string;
  companyInfo: string;
  csNumber: string;
}

interface BillingTemplateEditorProps {
  onTemplateChange?: (template: BillingTemplate) => void;
}

const defaultTemplate: BillingTemplate = {
  title: "🌐 TAGIHAN INTERNET - ZAIDNET",
  reminderText: "⏰ Reminder: Tagihan Anda akan jatuh tempo pada {due_date}. Mohon segera lakukan pembayaran untuk menghindari gangguan layanan.",
  paymentMethods: "💳 Cara Pembayaran:\n- Transfer Bank\n- Bayar Tunai ke Teknisi",
  contactInfo: "📞 Kontak: Hubungi kami jika ada pertanyaan",
  companyInfo: "🏠 Melayani: Hotspot & PPPoE",
  csNumber: "[Nomor CS]"
};

export function BillingTemplateEditor({ onTemplateChange }: BillingTemplateEditorProps) {
  const [template, setTemplate] = useState<BillingTemplate>(defaultTemplate);
  const [previewCustomer, setPreviewCustomer] = useState<CustomerBill | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved template from localStorage
    const saved = localStorage.getItem('billingTemplate');
    if (saved) {
      try {
        setTemplate(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading template:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('billingTemplate', JSON.stringify(template));
    onTemplateChange?.(template);
    toast({
      title: "Template Disimpan",
      description: "Template pesan tagihan berhasil disimpan.",
    });
  };

  const handleReset = () => {
    setTemplate(defaultTemplate);
    localStorage.removeItem('billingTemplate');
    toast({
      title: "Template Direset",
      description: "Template dikembalikan ke pengaturan awal.",
    });
  };

  const generatePreviewMessage = (customer: CustomerBill) => {
    const statusText = customer.status === 'pending' ? '⚠️ BELUM LUNAS' : '✅ SUDAH LUNAS';
    const dueDate = new Date(customer.due_date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const amount = `Rp ${customer.amount.toLocaleString('id-ID')}`;

    return `${template.title}

👤 Nama: ${customer.name}
      📦 Paket: ${customer.package_name || 'Paket Internet'}
💰 Nominal: ${amount}
📅 Jatuh Tempo: ${dueDate}
📍 Status: ${statusText}

${customer.status === 'pending'
  ? template.reminderText.replace('{due_date}', dueDate) + '\n\n' + template.paymentMethods + '\n\n' + template.contactInfo
  : '✅ Terima kasih! Pembayaran Anda sudah diterima.\n\n🌐 Layanan internet Anda akan terus berjalan normal.'}

---
ZaidNet - Layanan Internet Terpercaya
${template.companyInfo}
📱 Customer Service: ${template.csNumber}`;
  };

  const handlePreview = () => {
    // Create a sample customer for preview
    const sampleCustomer: CustomerBill = {
      id: 'preview',
      name: 'Nanang cisegel 3M',
      amount: 150000,
      status: 'pending',
      created_at: new Date().toISOString(),
      due_date: '2025-10-11',
      notes: '',
      phone_number: '081234567890',
      address: 'Jl. Contoh No. 123',
      package_name: '3 Member',
      latitude: undefined,
      longitude: undefined,
      photo_url: ''
    };
    setPreviewCustomer(sampleCustomer);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Template Pesan Tagihan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Pesan</Label>
            <Input
              id="title"
              value={template.title}
              onChange={(e) => setTemplate(prev => ({ ...prev, title: e.target.value }))}
              placeholder="🌐 TAGIHAN INTERNET - ZAIDNET"
            />
          </div>

          <div>
            <Label htmlFor="reminderText">Teks Reminder</Label>
            <Textarea
              id="reminderText"
              value={template.reminderText}
              onChange={(e) => setTemplate(prev => ({ ...prev, reminderText: e.target.value }))}
              placeholder="⏰ Reminder: Tagihan Anda akan jatuh tempo pada {due_date}. Mohon segera lakukan pembayaran..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="paymentMethods">Cara Pembayaran</Label>
            <Textarea
              id="paymentMethods"
              value={template.paymentMethods}
              onChange={(e) => setTemplate(prev => ({ ...prev, paymentMethods: e.target.value }))}
              placeholder="💳 Cara Pembayaran:"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="contactInfo">Info Kontak</Label>
            <Input
              id="contactInfo"
              value={template.contactInfo}
              onChange={(e) => setTemplate(prev => ({ ...prev, contactInfo: e.target.value }))}
              placeholder="📞 Kontak: Hubungi kami jika ada pertanyaan"
            />
          </div>

          <div>
            <Label htmlFor="companyInfo">Info Perusahaan</Label>
            <Input
              id="companyInfo"
              value={template.companyInfo}
              onChange={(e) => setTemplate(prev => ({ ...prev, companyInfo: e.target.value }))}
              placeholder="🏠 Melayani: Hotspot & PPPoE"
            />
          </div>

          <div>
            <Label htmlFor="csNumber">Nomor Customer Service</Label>
            <Input
              id="csNumber"
              value={template.csNumber}
              onChange={(e) => setTemplate(prev => ({ ...prev, csNumber: e.target.value }))}
              placeholder="[Nomor CS]"
            />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Simpan Template
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handlePreview} variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewCustomer && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Pesan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
              {generatePreviewMessage(previewCustomer)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}