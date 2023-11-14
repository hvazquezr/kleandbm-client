import { useAuth0 } from "@auth0/auth0-react";
import React, {useState} from "react";
//import Button from '@mui/material/Button';
import Button from '@mui/lab/LoadingButton';



const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(false);


  return <Button onClick={() => {loginWithRedirect(); setLoading(true)}} size="medium" variant="contained" loading={loading}>Log In</Button>;

};

export default LoginButton;