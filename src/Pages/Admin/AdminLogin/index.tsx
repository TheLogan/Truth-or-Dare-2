import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import Well from "../../../Components/Well";
import { supabase } from "../../../Components/Supabase";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setError(error ? error.message : "");
    setBusy(false);
  };

  return (
    <Well variant="light">
      <div className="adminLogin">
      <form onSubmit={handleLogin}>
        <Stack spacing={2}>
          <h3>Admin login</h3>
          {error && <i>{error}</i>}
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" disabled={busy}>Login</Button>
        </Stack>
      </form>
      </div>
    </Well>
  );
};

export default AdminLogin;
