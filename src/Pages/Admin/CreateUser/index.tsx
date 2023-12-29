import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import Well from "../../../Components/Well";
import { useActions } from "../../../Overmind";

const CreateUser: React.FC = () => {
  const { createUser } = useActions().admin;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const createUserClicked = () => {
    createUser({username, password});
  };

  return (
    <Well variant="light">
      <Grid container direction="column">
        <h3>Create New User</h3>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={createUserClicked} variant="contained">
          Create user
        </Button>
      </Grid>
    </Well>
  );
};

export default CreateUser;
