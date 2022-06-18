import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Avatar, Box, Button, CssBaseline, Grid, Link, Paper, TextField, Typography} from '@mui/material';
import request from "@/utils/request";
import * as cache from "@/utils/cache";
import {history} from 'umi';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://erd.zerocode.net.cn/">
        ERD Online
      </Link>{' '}
      {'2021'}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let username = data.get('username');
    let password = data.get('password');
    console.log({
      username: username,
      password: password,
    });
    request.get(
      '/auth/oauth/token?username=' + username + '&password=' + password + '&grant_type=password&scope=select',
    ).then(res => {
      if (res) {
        if (res.access_token) {
          cache.setItem('Authorization', res.access_token);
          cache.setItem('username', username);
          history.push({
            pathname: "/project/home"
          });

        }
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{height: '100vh'}}>
        <CssBaseline/>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(../login-bg.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              登录
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="账号"
                name="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="密码"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
              >
                登录
              </Button>
              <Copyright sx={{mt: 5}}/>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
