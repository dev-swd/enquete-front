import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import { getAuthUser, signOut } from '../../lib/api/breezeAuth';
import Loading from '../common/Loading';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

type User = {
  id: number | null;
  name: string;
  email: string;
}
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ id: null, name: "", email: "" });
  // アカウントメニュー制御
  const [anchorElAc, setAnchorElAc] = useState<any>(null);
  // パスワード変更
  const [showPwd, setShowPwd] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetAuthUser();    
  }, [])

  // ログイン中ユーザ取得
  const handleGetAuthUser = async () => {
    try {
      const res = await getAuthUser();
      if(res.data.id) {
        console.log("logined");
        setUser(res.data);
        setIsSignedIn(true);
      } else {
        console.log("not logined");
        setUser({ id: null, name: "", email: "" })
        setIsSignedIn(false);
      }  
    } catch (e) {
      console.log("API Error")
      setUser({ id: null, name: "", email: "" })
      setIsSignedIn(false);
  }
    setIsLoading(false);
  }

  // アカウントアイコンクリックの処理
  const handleAccountIconClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorElAc(e.currentTarget);
  }

  // アカウント終了時の処理
  const handleAccountClose = () => {
    setAnchorElAc(null);
  }

  // サインアウト時の処理
  const handleSignoutClick = () => {
    handleSignOut();
    setAnchorElAc(null);
  }

  // サインアウト処理
  const handleSignOut = async () => {
    setIsLoading(true);
    submitSignout();
  }

  const submitSignout =async () => {
    try {
      const res = await signOut();
    } catch (e) {
      // error
      setErr({severity: "error", message: "signOut Error"});
    }
    setIsLoading(false);
    setIsSignedIn(false);
    navigate('/admin');
  }

  // パスワード変更メニュークリック時の処理
  const handleChangePwdClick = () => {
    setShowPwd(true);
    setAnchorElAc(null);
  }

  // パスワード変更画面終了
  const handleChangePwdClose = () => {
    setShowPwd(false);
    alert("準備中です");
  }

  // 質問文作成
  const handleClickTemplate = () => {
    navigate('/admin/template');
  }

  // アンケート作成
  const handleClickEnquete = () => {
    navigate('/admin/enquete');
  }

  // 顧客登録
  const handleClickClient = () => {
    navigate('/admin/client');
  }

  // アンケート依頼
  const handleClickRequest = () => {
    navigate('/admin/request');
  }

  // 画面編集
  return (
    <>
      {isLoading ? (
        <Box>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>ダッシュボード</Typography>
              </Toolbar>
            </AppBar>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>ダッシュボード</Typography>
                { isSignedIn ? (
                  <>
                    <IconButton
                      size="medium"
                      edge="end"
                      color='inherit'
                      aria-label="account"
                      onClick={handleAccountIconClick}
                    >
                      <AccountCircleIcon fontSize='inherit' />
                    </IconButton>
                    <Menu
                      id='account-menu'
                      anchorEl={anchorElAc}
                      open={Boolean(anchorElAc)}
                      onClose={handleAccountClose}
                    >
                      <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={handleSignoutClick}>サインアウト</MenuItem>
                      <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={handleChangePwdClick}>パスワード変更（準備中）</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <IconButton
                    size="medium"
                    edge="end"
                    color='inherit'
                    aria-label="signin"
                    onClick={() => navigate("/admin/signin")}
                  >
                    <LoginIcon fontSize='inherit' />
                  </IconButton>
                )}
              </Toolbar>
            </AppBar>
          </Box>

          {(err.severity) &&
            <Stack sx={{width: '100%'}} spacing={1}>
              <Alert severity={err.severity}>{err.message}</Alert>
            </Stack>
          }

          { isSignedIn ? (
            <Box component='div' sx={{ pt: 8, px: 3, display: 'flex' }}>

              <Card sx={{ width: 200, height: 160, mr: 2, backgroundColor: '#55ccff'}}>
                <CardActionArea sx={{ width: '100%', height: '100%' }} onClick={(e) => handleClickTemplate()}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center' }} >
                      <img src='edit.svg' alt='edit' width='40%' height='40%'></img>
                      <Typography variant='h6' component='div'>
                        質問テンプレート作成
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>

              <Card sx={{ width: 200, height: 160, mr: 2, backgroundColor: '#55ccff'}}>
                <CardActionArea sx={{ width: '100%', height: '100%' }} onClick={(e) => handleClickEnquete()}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center' }} >
                      <img src='list.svg' alt='edit' width='40%' height='40%'></img>
                      <Typography variant='h6' component='div'>
                        アンケート作成
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>

              <Card sx={{ width: 200, height: 160, mr: 2, backgroundColor: '#55ccff'}}>
                <CardActionArea sx={{ width: '100%', height: '100%' }} onClick={(e) => handleClickClient()}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center' }} >
                      <img src='address.png' alt='client' width='40%' height='40%'></img>
                      <Typography variant='h6' component='div'>
                        宛先登録
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>

              <Card sx={{ width: 200, height: 160, mr: 2, backgroundColor: '#55ccff'}}>
                <CardActionArea sx={{ width: '100%', height: '100%' }} onClick={(e) => handleClickRequest()}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center' }} >
                      <img src='text.png' alt='request' width='40%' height='40%'></img>
                      <Typography variant='h6' component='div'>
                        アンケート依頼
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>

            </Box>
          ) : (
            <></>
          )}

        </Box>        
      )}
      <Loading isLoading={isLoading} />
    </>

  );
}
export default Dashboard;
