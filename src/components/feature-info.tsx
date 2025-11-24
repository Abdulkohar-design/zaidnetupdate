import { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function FeatureInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const mainFeatures = [
    "SETTING USER : Merubah dan menambah user",
    "PAKET INTERNET : menambah atau merubah harga paket internet", 
    "DATA PELANGGAN : menambah atau merubah data pelanggan",
    "PEMBAYARAN MASUK : menampilkan atau mencetak pembayaran masuk sesuai filter tanggal yang dipilih",
    "DASHBOARD : menampilkan data rekapitulasi realtime",
    "TOMBOL WA PADA TAGIHAN : mengingatkan tagihan pada pelanggan via chat wa",
    "TOMBOL PRINT PADA TAGIHAN : mencetak bukti pembayaran tagihan"
  ];

  const version2Features = [
    "Grafik bulanan pelanggan membayar",
    "Grafik Bulanan pelanggan belum membayar", 
    "Grafik bulanan jumlah pembayaran masuk",
    "Grafik bulanan tagihan belum terbayar",
    "Data tunggakan pembayaran pelanggan",
    "Export excel data pembayaran",
    "Export excel data tunggakan",
    "Pembagian wilayah pelanggan"
  ];

  const version3Features = [
    "Foto rumah pelanggan",
    "Koordinat Pelanggan",
    "Tanggal Jatuh tempo", 
    "Map semua lokasi pelanggan",
    "Format pesan yang lebih rapi"
  ];

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Keterangan Menu & Fitur</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Fitur Utama</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-xs sm:text-sm">
                  {mainFeatures.map((feature, index) => (
                    <li key={index} className="flex">
                      <span className="font-semibold mr-2 flex-shrink-0">{index + 1}.</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Update Versi 2</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Fitur Grafik dan Analitik</p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-xs sm:text-sm" start={8}>
                  {version2Features.map((feature, index) => (
                    <li key={index} className="flex">
                      <span className="font-semibold mr-2 flex-shrink-0">{index + 8}.</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Update Versi 3</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Fitur Geolokasi & Enhanced UX</p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-xs sm:text-sm">
                  {version3Features.map((feature, index) => (
                    <li key={index} className="flex">
                      <span className="font-semibold mr-2 flex-shrink-0">{index + 1}.</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-6">
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                <strong>Deployment:</strong> Aplikasi berbasis web bisa Online dan Offline. 
                Untuk offline bisa diinstall di PC/Laptop, untuk online wajib memiliki domain dan hosting.
              </p>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
