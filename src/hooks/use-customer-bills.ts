import { useState, useEffect } from 'react';
import { CustomerBill } from '@/types/wifi-billing';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

// Helper function to parse dates from Supabase string format to Date objects
const parseCustomerDates = (customer: any): CustomerBill => ({
  ...customer,
  due_date: customer.due_date ? new Date(customer.due_date) : new Date(),
  created_at: customer.created_at ? new Date(customer.created_at) : new Date(),
});

export const useCustomerBills = (tableName: string) => {
  const [customers, setCustomers] = useState<CustomerBill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tableName) {
      setCustomers([]);
      setLoading(false);
      return;
    }
    fetchCustomers();

    // Subscribe to real-time changes for the selected table
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`Supabase Realtime (${tableName}): INSERT received`, payload.new);
          setCustomers((prev) => {
            const updatedCustomers = [...prev, parseCustomerDates(payload.new)];
            console.log(`useCustomerBills (${tableName}): Customers state after INSERT`, updatedCustomers);
            return updatedCustomers;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`Supabase Realtime (${tableName}): UPDATE received`, payload.new);
          setCustomers((prev) => {
            const updatedCustomers = prev.map((customer) =>
              customer.id === payload.new.id ? parseCustomerDates(payload.new) : customer
            );
            console.log(`useCustomerBills (${tableName}): Customers state after UPDATE`, updatedCustomers);
            return updatedCustomers;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`Supabase Realtime (${tableName}): DELETE received`, payload.old);
          setCustomers((prev) => {
            const updatedCustomers = prev.filter((customer) => customer.id !== payload.old.id);
            console.log(`useCustomerBills (${tableName}): Customers state after DELETE`, updatedCustomers);
            return updatedCustomers;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]); // Re-run effect when tableName changes

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      showError(`Gagal memuat data pelanggan dari ${tableName}`);
      console.error(`Error fetching customers from ${tableName}:`, error);
      setCustomers([]); // Clear customers on error
    } else {
      const parsedData = data.map(parseCustomerDates);
      setCustomers(parsedData);
      console.log(`useCustomerBills (${tableName}): Customers fetched from DB`, parsedData);
    }
    setLoading(false);
  };

  const addCustomer = async (customer: Omit<CustomerBill, 'id' | 'created_at' | 'due_date'>) => {
    const { data, error } = await supabase
      .from(tableName)
      .insert([
        {
          name: customer.name,
          amount: customer.amount,
          status: customer.status,
          paymentMethod: customer.paymentMethod,
          notes: customer.notes,
          phone_number: customer.phone_number,
          address: customer.address,
          package_name: customer.package_name,
          latitude: customer.latitude,
          longitude: customer.longitude,
          photo_url: customer.photo_url,
          due_date: new Date().toISOString(), // Ensure ISO string for Supabase
          created_at: new Date().toISOString(), // Ensure ISO string for Supabase
        },
      ])
      .select();

    if (error) {
      showError('Gagal menambahkan pelanggan');
      console.error('Error adding customer:', error);
    } else {
      showSuccess('Pelanggan baru berhasil ditambahkan');
      fetchCustomers();
      return parseCustomerDates(data[0]);
    }
  };

  const updateCustomer = async (id: string, updates: Partial<CustomerBill>) => {
    const { data, error } = await supabase
      .from(tableName)
      .update({
        name: updates.name,
        amount: updates.amount,
        status: updates.status,
        paymentMethod: updates.paymentMethod,
        notes: updates.notes,
        phone_number: updates.phone_number,
        address: updates.address,
        package_name: updates.package_name,
        latitude: updates.latitude,
        longitude: updates.longitude,
        photo_url: updates.photo_url,
        due_date: updates.due_date instanceof Date ? updates.due_date.toISOString() : undefined,
      })
      .eq('id', id)
      .select();

    if (error) {
      showError('Gagal memperbarui data pelanggan');
      console.error('Error updating customer:', error);
    } else {
      showSuccess('Data pelanggan berhasil diperbarui');
      fetchCustomers();
      return parseCustomerDates(data[0]);
    }
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      showError('Gagal menghapus data pelanggan');
      console.error('Error deleting customer:', error);
    } else {
      showSuccess('Data pelanggan berhasil dihapus');
      fetchCustomers();
    }
  };

  const deleteCustomers = async (ids: string[]) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .in('id', ids);

    if (error) {
      showError('Gagal menghapus data pelanggan');
      console.error('Error deleting customers:', error);
    } else {
      showSuccess(`${ids.length} pelanggan berhasil dihapus`);
      fetchCustomers();
    }
  };

  const importCustomers = async (newCustomers: Omit<CustomerBill, 'id' | 'created_at' | 'due_date'>[]) => {
    const customersToInsert = newCustomers.map(customer => ({
      name: customer.name,
      amount: customer.amount,
      status: customer.status,
      paymentMethod: customer.paymentMethod,
      notes: customer.notes,
      phone_number: customer.phone_number,
      address: customer.address,
      package_name: customer.package_name,
      latitude: customer.latitude,
      longitude: customer.longitude,
      photo_url: customer.photo_url,
      due_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from(tableName)
      .insert(customersToInsert)
      .select();

    if (error) {
      showError('Gagal mengimpor data pelanggan');
      console.error('Error importing customers:', error);
    } else {
      showSuccess(`${newCustomers.length} pelanggan berhasil diimpor`);
      fetchCustomers();
      return data.map(parseCustomerDates);
    }
  };

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    deleteCustomers,
    importCustomers,
    fetchCustomers,
  };
};