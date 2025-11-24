import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000000';

export const useEmployeeSettings = () => {
  const [employeeName, setEmployeeName] = useState('Pegawai Zaid Net');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeName();
    // Subscribe to real-time changes for employee settings
    const channel = supabase
      .channel('employee-settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'employee_settings',
          filter: `id=eq.${SETTINGS_ID}`
        },
        (payload) => {
          console.log('Supabase Realtime: Employee Settings UPDATE received', payload.new);
          if (payload.new.employee_name) {
            setEmployeeName(payload.new.employee_name);
            console.log('useEmployeeSettings: Employee name state updated by Realtime', payload.new.employee_name);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEmployeeName = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('employee_settings')
      .select('employee_name')
      .eq('id', SETTINGS_ID)
      .single();

    if (error) {
      console.error('Error fetching employee name:', error);
      // If default row doesn't exist, insert it
      if (error.code === 'PGRST116') { // No rows found
        console.log('Default employee settings not found, inserting...');
        const { error: insertError } = await supabase
          .from('employee_settings')
          .insert({ id: SETTINGS_ID, employee_name: 'Pegawai Zaid Net' });
        if (insertError) {
          console.error('Error inserting default employee settings:', insertError);
        } else {
          setEmployeeName('Pegawai Zaid Net');
          console.log('useEmployeeSettings: Default employee name inserted and set.');
        }
      }
    } else if (data) {
      setEmployeeName(data.employee_name);
      console.log('useEmployeeSettings: Employee name fetched from DB', data.employee_name);
    }
    setLoading(false);
  };

  const updateEmployeeName = async (newName: string) => {
    const { data, error } = await supabase
      .from('employee_settings')
      .update({ employee_name: newName })
      .eq('id', SETTINGS_ID)
      .select();

    if (error) {
      showError('Gagal memperbarui nama pegawai');
      console.error('Error updating employee name:', error);
    } else {
      // Realtime subscription should handle the UI update, but set directly as fallback
      setEmployeeName(newName);
      showSuccess('Nama pegawai berhasil diperbarui');
      console.log('useEmployeeSettings: Employee name updated in DB and state', newName);
      return data[0];
    }
  };

  return {
    employeeName,
    loading,
    updateEmployeeName,
  };
};