import { useState, useEffect } from "react";
import { MapPin, Target, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  customerName?: string;
}

export function LocationPicker({ latitude, longitude, onLocationChange, customerName = "Pelanggan" }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLat, setTempLat] = useState(latitude || -6.2);
  const [tempLng, setTempLng] = useState(longitude || 106.816666);
  const [searchAddress, setSearchAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setTempLat(lat);
          setTempLng(lng);
          setIsLoading(false);
          toast({
            title: "Lokasi Ditemukan",
            description: "Lokasi saat ini berhasil dideteksi",
          });
        },
        (error) => {
          setIsLoading(false);
          toast({
            title: "Error GPS",
            description: "Tidak dapat mengakses lokasi. Pastikan GPS aktif dan izin diberikan.",
            variant: "destructive"
          });
        }
      );
    } else {
      setIsLoading(false);
      toast({
        title: "GPS Tidak Didukung",
        description: "Browser Anda tidak mendukung geolocation",
        variant: "destructive"
      });
    }
  };

  const handleSaveLocation = () => {
    onLocationChange(tempLat, tempLng);
    setIsOpen(false);
    toast({
      title: "Lokasi Disimpan",
      description: `Koordinat untuk ${customerName} berhasil disimpan`,
    });
  };

  const searchLocation = async () => {
    if (!searchAddress.trim()) return;
    
    setIsLoading(true);
    try {
      // Menggunakan Nominatim OpenStreetMap untuk geocoding (gratis)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setTempLat(lat);
        setTempLng(lng);
        toast({
          title: "Lokasi Ditemukan",
          description: `Alamat "${searchAddress}" berhasil ditemukan`,
        });
      } else {
        toast({
          title: "Alamat Tidak Ditemukan",
          description: "Coba gunakan alamat yang lebih spesifik",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error Pencarian",
        description: "Gagal mencari alamat. Periksa koneksi internet Anda.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const formatCoordinate = (value: number) => {
    return value.toFixed(6);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base">Koordinat GPS</Label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          type="number"
          step="any"
          placeholder="Latitude"
          value={latitude || ''}
          onChange={(e) => onLocationChange(parseFloat(e.target.value) || 0, longitude || 0)}
          className="text-sm sm:text-base"
        />
        <Input
          type="number"
          step="any"
          placeholder="Longitude"
          value={longitude || ''}
          onChange={(e) => onLocationChange(latitude || 0, parseFloat(e.target.value) || 0)}
          className="text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              Pilih di Peta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto modal-content">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Pilih Lokasi {customerName}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Search Address */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Cari alamat... (contoh: Jl. Sudirman Jakarta)"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                  className="text-sm sm:text-base"
                />
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    onClick={searchLocation} 
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="button"
                    onClick={getCurrentLocation} 
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    <Target className="h-4 w-4" />
                    GPS
                  </Button>
                </div>
              </div>

              {/* Current Coordinates */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium">Koordinat Terpilih:</div>
                <div className="text-base sm:text-lg font-mono">
                  {formatCoordinate(tempLat)}, {formatCoordinate(tempLng)}
                </div>
              </div>

              {/* Interactive Map */}
              <div className="relative h-64 sm:h-96 bg-gray-100 rounded-lg overflow-hidden border">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${tempLat},${tempLng}&zoom=16`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Manual coordinate input overlay */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 bg-white p-2 sm:p-3 rounded-lg shadow-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Latitude</Label>
                      <Input
                        type="number"
                        step="any"
                        value={tempLat}
                        onChange={(e) => setTempLat(parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Longitude</Label>
                      <Input
                        type="number"
                        step="any"
                        value={tempLng}
                        onChange={(e) => setTempLng(parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Instructions overlay */}
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-blue-600 text-white p-2 sm:p-3 rounded-lg">
                  <div className="text-xs sm:text-sm">
                    <strong>Cara menentukan lokasi:</strong>
                    <ol className="mt-1 text-xs">
                      <li>1. Klik kanan di peta Google Maps → "What's here?"</li>
                      <li>2. Copy koordinat yang muncul</li>
                      <li>3. Paste di form Latitude/Longitude di atas</li>
                      <li>4. Atau gunakan pencarian alamat/GPS</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Quick Location Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTempLat(-6.2088);
                    setTempLng(106.8456);
                  }}
                  className="text-xs sm:text-sm"
                >
                  Jakarta Pusat
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTempLat(-6.9175);
                    setTempLng(107.6191);
                  }}
                  className="text-xs sm:text-sm"
                >
                  Bandung
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTempLat(-7.7956);
                    setTempLng(110.3695);
                  }}
                  className="text-xs sm:text-sm"
                >
                  Yogyakarta
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTempLat(-7.2504);
                    setTempLng(112.7688);
                  }}
                  className="text-xs sm:text-sm"
                >
                  Surabaya
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
                  Batal
                </Button>
                <Button type="button" onClick={handleSaveLocation} className="w-full sm:w-auto">
                  <MapPin className="h-4 w-4 mr-2" />
                  Simpan Lokasi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {(latitude && longitude) && (
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank')}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Lihat
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Klik "Pilih di Peta" untuk menentukan lokasi menggunakan Google Maps
      </p>
    </div>
  );
}

