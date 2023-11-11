import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from '@mui/material/Button'

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button onClick={() => logout({ logoutParams: { returnTo: "https://127.0.0.1:5173" } })}
        size="medium"
        variant="outlined"
        color="inherit"
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;