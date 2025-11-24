import { useState, useMemo } from "react";
import { MapPin, Navigation, Eye, Phone, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CustomerBill } from "@/types/wifi-billing";
import { WhatsAppButton } from "./whatsapp-button";
import { PrintButton } from "./print-button";

interface CustomerMapProps {
  customers: CustomerBill[];
}

export function CustomerMap({ customers }: CustomerMapProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerBill | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const customersWithLocation = useMemo(() => {
    return customers.filter(customer => 
      customer.latitude !== undefined && 
      customer.longitude !== undefined
    );
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

  const openInGoogleMaps = (customer: CustomerBill) => {
    if (customer.latitude && customer.longitude) {
      const url = `https://www.google.com/maps?q=${customer.latitude},${customer.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getDirections = (customer: CustomerBill) => {
    if (customer.latitude && customer.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${customer.latitude},${customer.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const centerLocation = useMemo(() => {
    if (customersWithLocation.length === 0) return { lat: -6.2, lng: 106.816666 }; // Default Jakarta
    
    const avgLat = customersWithLocation.reduce((sum, c) => sum + (c.latitude || 0), 0) / customersWithLocation.length;
    const avgLng = customersWithLocation.reduce((sum, c) => sum + (c.longitude || 0), 0) / customersWithLocation.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [customersWithLocation]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Home className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dengan Lokasi GPS</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{customersWithLocation.length}</div>
            <p className="text-xs text-muted-foreground">
              {((customersWithLocation.length / customers.length) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Ada Lokasi</CardTitle>
            <MapPin className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {customers.length - customersWithLocation.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Embed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Peta Lokasi Pelanggan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customersWithLocation.length > 0 ? (
            <div className="space-y-4">
              {/* Google Maps Embed */}
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${centerLocation.lat},${centerLocation.lng}&zoom=14`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Custom markers overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* This would need actual map integration for precise positioning */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      {customersWithLocation.length} Lokasi Pelanggan
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={() => window.open(`https://www.google.com/maps/@${centerLocation.lat},${centerLocation.lng},15z`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Buka Google Maps
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Data Lokasi</h3>
              <p className="text-muted-foreground">
                Belum ada pelanggan yang memiliki koordinat GPS. Tambahkan koordinat pada data pelanggan untuk melihat peta.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer List with Locations */}
      {customersWithLocation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pelanggan dengan Lokasi GPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customersWithLocation.map((customer) => (
                <div key={customer.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {customer.address || 'Alamat tidak tersedia'}
                        </p>
                        <p className="text-xs text-blue-600">
                          GPS: {customer.latitude?.toFixed(6)}, {customer.longitude?.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                      </Badge>
                      <span className="font-medium">
                        {formatCurrency(customer.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Paket: {customer.package_name || 'Tidak ada'} | 
                      Jatuh Tempo: {formatDate(customer.due_date)}
                    </div>

                    <div className="flex gap-2">
                      <Dialog open={isDetailOpen && selectedCustomer?.id === customer.id} onOpenChange={setIsDetailOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detail Pelanggan: {customer.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {customer.photoUrl && (
                              <div>
                                <h4 className="font-medium mb-2">Foto Rumah</h4>
                                <img 
                                  src={customer.photoUrl} 
                                  alt={`Rumah ${customer.name}`}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium">Informasi Pelanggan</h4>
                                <p>Nama: {customer.name}</p>
                                <p>Paket: {customer.package_name || '-'}</p>
                                <p>WhatsApp: {customer.phone_number || '-'}</p>
                                <p>Status: {customer.status === 'paid' ? 'Lunas' : 'Belum Bayar'}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Lokasi</h4>
                                <p>Alamat: {customer.address || '-'}</p>
                                <p>Lat: {customer.latitude?.toFixed(6)}</p>
                                <p>Lng: {customer.longitude?.toFixed(6)}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openInGoogleMaps(customer)}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Maps
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => getDirections(customer)}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Rute
                      </Button>

                      <WhatsAppButton customer={customer} />
                      <PrintButton customer={customer} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers without location */}
      {customers.length - customersWithLocation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              Pelanggan Tanpa Koordinat GPS ({customers.length - customersWithLocation.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {customers
                .filter(c => !c.latitude || !c.longitude)
                .map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {customer.address || 'Alamat tidak tersedia'}
                      </span>
                    </div>
                    <Badge variant="secondary">Belum ada GPS</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

