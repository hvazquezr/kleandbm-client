import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from '@mui/material/Button'


const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()} size="medium" variant="outlined" color="inherit">Log In</Button>;

};

export default LoginButton;