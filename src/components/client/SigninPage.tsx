import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { GlobalContext } from '../../App';
import { hankakuOnly } from '../../lib/common/inputRegulation';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import Loading from '../common/Loading';
import { signIn, SignInParams } from '../../lib/api/enquete';
import { sanctum } from '../../lib/api/breezeAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

const SigninPage: React.FC = () => {
  const { setIsSignedIn, setEnqueteInfo } = useContext(GlobalContext)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [email, setEmail] = useState<string>("");
  const [enqueteCode, setEnqueteCode] = useState<string>("");

  // submitボタン押下時の処理
  const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setIsLoading(true);
    submitSignIn();
  }

  // サインイン
  const submitSignIn = async () => {
    const params: SignInParams = {
      email: email,
      enqueteCode: enqueteCode
    }
    try {
      const res0 = await sanctum();
      const res = await signIn(params);
      console.log(res);
      setIsLoading(false);
      if(res.data.status==='normal'){
        setEnqueteInfo({
          id: res.data.enquete.id,
          company: res.data.enquete.company,
          division: res.data.enquete.division,
          person: res.data.enquete.person,
          email: res.data.enquete.email,
          code: res.data.enquete.enqueteCode,
          name: res.data.enquete.name,
          items: res.data.items
        });
        setIsSignedIn(true);
        // メイン画面に遷移
        navigate(`/`);
      } else if(res.data.status==='answered') {
        // error
        setErr({severity: "error", message: "このアンケートは既に回答済です。"});
      } else {
        // error
        setErr({severity: "error", message: "該当するアンケートがありません。"});
      }

    } catch (e) {
      // error
      setErr({severity: "error", message: "予期せぬエラーが発生しました。"});
      setIsLoading(false);
    } 
  }
    
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
            <TextField
              required
              fullWidth
              id="enqueteCode"
              name="enqueteCode"
              label="アンケートコード"
              value={enqueteCode}
              onChange={(e) => setEnqueteCode(hankakuOnly(e.target.value))}
              variant="outlined"
              size="small"
              sx={{ mt: 5 }}
              autoComplete='username'
              inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
            />

            <Button 
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              color="primary"
              disabled={ !email || !enqueteCode ? true : false}
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
