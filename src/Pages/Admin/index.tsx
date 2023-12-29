export default function AdminLogin() {
  return <div>Admin - not implemented</div>;
}


// import { Button } from "@mui/material";
// import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
// import Layout from "../../Components/Layout";
// import PrivateRoute from "../../Components/PrivateRoute";
// import { useAppState } from "../../Overmind";
// import AdminLogin from "./AdminLogin";
// import CardBrowser from "./CardBrowser";
// import CreateUser from "./CreateUser";
// import EditBrowser from "./EditBrowser";
// import "./style.scss";

// const Admin: React.FC = (props) => {
//   const { url } = useRouteMatch();
//   const { login } = useAppState();
//   const history = useHistory();

//   const renderMenu = () => {
//     if (login.token) {
//       return (
//         <div>
//           <Button
//             variant="contained"
//             onClick={() => history.push("/admin/browse")}
//           >
//             Browse cards
//           </Button>
//           {login.role === "ADMIN" && (
//             <>
//               <Button
//                 variant="contained"
//                 onClick={() => history.push("/admin/reviewEdits")}
//               >
//                 Review card edits
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={() => history.push("/admin/createUser")}
//               >
//                 Create User
//               </Button>
//             </>
//           )}
//         </div>
//       );
//     }
//     return (
//       <Button variant="contained" onClick={() => history.push("/admin/login")}>
//         Log in
//       </Button>
//     );
//   };

//   return (
//     <>
//       <Layout>
//         <Switch>
//           <Route exact path={url}>
//             <h3>Admin Menu</h3>
//             {renderMenu()}
//           </Route>
//           <Route path={`${url}/login`}>
//             <AdminLogin />
//           </Route>
//           <PrivateRoute path={`${url}/browse`}>
//             <CardBrowser />
//           </PrivateRoute>
//           <PrivateRoute path={`${url}/createUser`}>
//             <CreateUser />
//           </PrivateRoute>
//           <PrivateRoute path={`${url}/reviewEdits`}>
//             <EditBrowser />
//           </PrivateRoute>
//         </Switch>
//       </Layout>
//     </>
//   );
// };

// export default Admin;
