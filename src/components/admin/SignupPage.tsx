import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import { sanctum, signUp, SignUpParams } from '../../lib/api/breezeAuth';
import Loading from '../common/Loading';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

const SignupPage: React.FC = () => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: ""});
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [passwordConShow, setPasswordConShow] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // submitボタン押下時の処理
  const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setIsLoading(true);
    submitSignUp();
  }

  // サインアップ
  const submitSignUp = async () => {

    const params: SignUpParams = {
      name: name, 
      email: email, 
      password: password, 
      passwordConfirmation: passwordConfirmation,
    }

    try {
      const res0 = await sanctum();
      const res = await signUp(params);
      setIsLoading(false);
      console.log(res);
    } catch (e) {
      // error
      setErr({severity: "error", message: "Signup Error"});
      setIsLoading(false);
    } 
  }

  // 画面編集
  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar variant="dense">
            <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>プロジェクト管理アプリ</Typography>
            <Button component={Link} to="/admin/signin" sx={{textTransform: 'none', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} color="inherit">Sign in</Button>
          </Toolbar>
        </AppBar>
      </Box>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1}>
        <Alert severity={err.severity}>{err.message}</Alert>
      </Stack>
      }

      <Box component='div' sx={{ mt: 5, paddingLeft: 2, paddingRight: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card style={{ padding: '2', maxWidth: '600px' }}>
          <CardHeader style={{ textAlign: 'center' }} title='Sign up' />
          <CardContent>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              size="small"
              type="text"
              inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
            />
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              size="small"
              type="email"
              sx={{ mt: 2 }}
              autoComplete='username'
              inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
            />
            <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 2 }} required>
              <InputLabel htmlFor="new-password" style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}>Password</InputLabel>
              <OutlinedInput
                id="new-password"
                type={passwordShow ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) => setPasswordShow(!passwordShow)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {passwordShow ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 2 }} required>
              <InputLabel htmlFor="new-password-confirmation" style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}>Password Confirmation</InputLabel>
              <OutlinedInput
                id="new-password-confirmation"
                type={passwordConShow ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password confirmation visibility"
                      onClick={(e) => setPasswordConShow(!passwordConShow)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {passwordConShow ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password Confirmation"
              />
            </FormControl>
            <Button 
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              color="primary"
              disabled={ !name || !email || !password || !passwordConfirmation ? true : false}
              onClick={(e) => handleSubmit(e)}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Submit
            </Button>          
          </CardContent>
        </Card>
      </Box>

      <Loading isLoading={isLoading} />

    </Box>
  );
}
export default SignupPage;
