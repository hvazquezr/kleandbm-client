import * as React from 'react';
import {Box, Stack} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';

import {appUrl} from '../config/UrlConfig'


function UserAvatar({user, onLogout}) {

  //console.log(user.picture);

  return (
    <Box sx={{ width:'100%' }}>
      <Stack direction="row" p={1} spacing={2} justifyItems="flex-start" alignItems="center">
          <Avatar alt={user.name} src={user.picture}     sx={{
              border: '1px solid gray'
            }}/>
          <Typography variant="h6">{user.name}</Typography>
      </Stack>
      <Divider />
      <MenuItem key="account">
          <ListItemIcon>
              <ManageAccountsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Manage Account</ListItemText>
      </MenuItem>
      <MenuItem key="logout" onClick={() => onLogout({ logoutParams: { returnTo: appUrl } })}>
          <ListItemIcon>
              <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Box>
  );
}
export default UserAvatar;