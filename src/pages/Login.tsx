import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "../App"; // ⬅️ Import context!

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser(); // ⬅️ Ambil function login dari context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Query ke tabel users
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    setLoading(false);

    if (error || !data) {
      toast({
        title: "Login Gagal",
        description: "Username tidak ditemukan.",
        variant: "destructive"
      });
      return;
    }

    // Cek password dari database (plaintext, BISA DIGANTI HASH!)
    if (password !== data.password_hash) {
      toast({
        title: "Login Gagal",
        description: "Password salah.",
        variant: "destructive"
      });
      return;
    }

    // === SIMPAN DENGAN CONTEXT login()! ===
    login({
      id: data.id,
      username: data.username,
      full_name: data.full_name,
      role: data.role,
      employee_tagihan_table_name: data.employee_tagihan_table_name
    });

    toast({
      title: "Login Berhasil",
      description: `Selamat datang, ${data.full_name || data.username}!`
    });
    navigate("/"); // redirect ke home/dashboard
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Login Zaid Net (Manual Users)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
