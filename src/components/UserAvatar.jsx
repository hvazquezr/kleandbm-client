import * as React from 'react';
import {Box, Stack} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';

import {appUrl} from '../config/UrlConfig'


function UserAvatar({user, onLogout, layoutType = 'HomePage'}) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  if (layoutType === 'HomePage'){
    return (
      <Box sx={{ flexGrow: 0 }}>
      <Tooltip title={user.name}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={user.name} src={user.picture}/>
          </IconButton>
      </Tooltip>
      <Menu
          sx={{ mt: '45px' }}
          anchorEl={anchorElUser}
          anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
      >
          
          <MenuItem key="logout" onClick={() => onLogout({ logoutParams: { returnTo: appUrl } })}>
              <ListItemIcon>
                  <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
          </MenuItem>
      </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{ width:'100%' }}>
      <Stack direction="row" p={1} spacing={2} justifyItems="flex-start" alignItems="center">
          <Avatar alt={user.name} src={user.picture}     sx={{
              border: '1px solid gray'
            }}/>
          <Typography variant="h6">{user.name}</Typography>
      </Stack>
      <Divider />
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