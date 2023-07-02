import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { hankakuOnly } from '../../lib/common/inputRegulation';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import { sanctum, SignInParams, signIn } from '../../lib/api/breezeAuth';
import Loading from '../common/Loading';

import Box from '@mui/material/Box';
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

const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  // submitボタン押下時の処理
  const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setIsLoading(true);
    submitSignIn();
  }

  // サインイン
  const submitSignIn = async () => {

    const params: SignInParams = {
      email: email,
      password: password
    }

    try {
      const res0 = await sanctum();
      const res1 = await signIn(params);
      setIsLoading(false);
      console.log(res1);
      // ダッシュボードに遷移
      navigate(`/admin`);
    } catch (e) {
      // error
      setErr({severity: "error", message: "Signin Error"});
      setIsLoading(false);
    } 
  }

  // 画面編集
  return (
    <Box sx={{ height: '100vh', backgroundColor: '#c9e9f1' }}>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1}>
        <Alert severity={err.severity}>{err.message}</Alert>
      </Stack>
      }

      <Box component='div' sx={{ paddingTop: 20, paddingLeft: 2, paddingRight: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
        <Card style={{ padding: '2', maxWidth: '600px' }}>
          <CardHeader style={{ textAlign: 'center' }} title='ログイン' />
          <CardContent>
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
            <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 5 }} required>
              <InputLabel htmlFor="current-password" style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}>Password</InputLabel>
              <OutlinedInput
                id="current-password"
                type={passwordShow ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(hankakuOnly(e.target.value))}
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

            <Button 
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              color="primary"
              disabled={ !email || !password ? true : false}
              onClick={(e) => handleSubmit(e)}
              sx={{ mt: 5, mb: 3, textTransform: 'none' }}
            >
              Submit
            </Button>

          </CardContent>
        </Card>
      </Box>

      <Loading isLoading={isLoading} />

    </Box>
  )
}
export default SigninPage;
