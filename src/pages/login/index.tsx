import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Avatar, Box, CssBaseline, Grid, Link, Paper, Typography} from '@mui/material';
import {GLOBAL_REQUEST_URL} from "@/utils/request";


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
    console.log({
      email: data.get('email'),
      password: data.get('password'),
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
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>


              <iframe src={`${GLOBAL_REQUEST_URL}/auth/oauth2/authorization/wechat`}
                      style={{"border": "none"}}
                      scrolling="no" height="500px"
                      sandbox="allow-scripts  allow-top-navigation"

              >
                <h3>使用微信扫码登录</h3>
              </iframe>
              <Copyright sx={{mt: 5}}/>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
