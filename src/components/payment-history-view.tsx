import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { History, Calendar, DollarSign, CreditCard } from "lucide-react";

interface PaymentHistory {
    id: string;
    customer_id: string;
    customer_name: string;
    amount: number;
    payment_method: string;
    payment_date: string;
    notes?: string;
    proof_url?: string;
}

interface PaymentHistoryViewProps {
    customerId?: string;
    customerName?: string;
}

export function PaymentHistoryView({ customerId, customerName }: PaymentHistoryViewProps) {
    const [history, setHistory] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [customerId, customerName]);

    const fetchHistory = async () => {
        setLoading(true);

        let query = supabase
            .from('payment_history')
            .select('*')
            .order('payment_date', { ascending: false });

        if (customerId) {
            query = query.eq('customer_id', customerId);
        } else if (customerName) {
            query = query.ilike('customer_name', `%${customerName}%`);
        }

        const { data, error } = await query.limit(50);

        if (error) {
            console.error('Error fetching payment history:', error);
        } else {
            setHistory(data || []);
        }

        setLoading(false);
    };

    const formatCurrency = (amount: number) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-gray-500">Memuat riwayat...</p>
                </CardContent>
            </Card>
        );
    }

    if (history.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Riwayat Pembayaran
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-500 py-8">
                        Belum ada riwayat pembayaran
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Riwayat Pembayaran {customerName && `- ${customerName}`}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-semibold text-lg">{item.customer_name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(item.payment_date)}
                                    </div>
                                </div>
                                <Badge
                                    className={item.payment_method === 'transfer' ? 'bg-purple-600' : 'bg-green-600'}
                                >
                                    {item.payment_method === 'transfer' ? 'Transfer' : 'Tunai'}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-xl font-bold text-green-600 mb-2">
                                <DollarSign className="h-5 w-5" />
                                {formatCurrency(item.amount)}
                            </div>

                            {item.notes && (
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">Catatan:</span> {item.notes}
                                </p>
                            )}

                            {item.proof_url && (
                                <div className="mt-2">
                                    <a
                                        href={item.proof_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        Lihat Bukti Transfer
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
