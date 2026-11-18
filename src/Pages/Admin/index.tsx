import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Layout from "../../Components/Layout";
import { supabase } from "../../Components/Supabase";
import AdminLogin from "./AdminLogin";
import CardBrowser from "./CardBrowser";
import "./style.scss";

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (loading) return <Layout><p>Loading...</p></Layout>;

  if (!session) {
    return (
      <Layout>
        <AdminLogin />
      </Layout>
    );
  }

  return (
    <Layout>
      <Stack direction="row" spacing={2} className="adminNav">
        <Button variant="contained" onClick={() => navigate("/")}>Main menu</Button>
        <Button variant="contained" onClick={() => supabase.auth.signOut()}>
          Log out
        </Button>
      </Stack>
      <Routes>
        <Route path="*" element={<CardBrowser />} />
      </Routes>
    </Layout>
  );
};

export default Admin;
