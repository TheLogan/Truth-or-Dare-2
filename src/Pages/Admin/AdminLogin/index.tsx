export default function AdminLogin() {
  return <div>Admin login - not implemented</div>;
}

// import { Button, Grid, TextField } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useHistory } from "react-router";
// import Well from "../../../Components/Well";
// import { useActions, useAppState } from "../../../Overmind";

// const AdminLogin: React.FC = () => {
//   const { login } = useAppState()
//   const { loginAdmin } = useActions().admin;
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const history = useHistory();

//   const handleLogin = () => {
//     if (!username) return;
//     if (!password) return;
//     loginAdmin({ username, password });
//   };

//   useEffect(() => {
//     if(login.token !== '' && login.token != null) {
//       history.push('/admin');
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [login])

//   return (
//     <Well variant="light">
//       <Grid container direction="column">
//         <h3>Login</h3>
//         <i>{login.error}</i>
//         <TextField
//           label="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <TextField
//           label="Password"
//           value={password}
//           type="password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button onClick={handleLogin} variant="contained">
//           Login
//         </Button>
//       </Grid>
//     </Well>
//   );
// };

// export default AdminLogin;
