import { useState } from 'react';

import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import { isEmpty } from '../../../lib/common/isEmpty';
import { addClient, addClientParams } from '../../../lib/api/enquete';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';

type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const ClientNewPage = (props: Props) => {
  const [company, setCompany] = useState<string>("");
  const [division, setDivision] = useState<string>("");
  const [person, setPerson] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setCompany("");
    setDivision("");
    setPerson("");
    setEmail("");
    setErr({severity: null, message: ""});
  }
  
  // 登録
  const handleSubmit = () => {
    setConfirm({
      message: "現在の情報で保存します。よろしいですか。",
      tag: null,
      width: 400
    });
  }

  // 登録確認OK処理
  const handleSubmitOK = (dummy :null) => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading(true);
    saveClient();
  }

  // 登録処理
  const saveClient = async () => {
    const params:addClientParams = {
      company: company,
      division: division,
      person: person,
      email: email
    }
    try {
      const res = await addClient(params);
      if (res.data.status === "200") {
        props.close(true);
        setCompany("");
        setDivision("");
        setPerson("");
        setEmail("");
        setErr({severity: null, message: ""});
      } else {
        setErr({severity: "error", message: "APIエラー(200以外)"});
      }
    } catch (e) {
      setErr({severity: "error", message: "APIエラー"});
    }
    setIsLoading(false);
  }

  // 登録確認Cancel処理
  const handleSubmitCancel = () => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // 登録ボタン非活性
  const disabledSubmit = () => {
    if(isEmpty(company) || isEmpty(division) || isEmpty(person) || isEmpty(email) ) return true;
  }

  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '90%', width: '60vw', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>宛先追加</Typography>
                <IconButton
                  size="medium"
                  edge="end"
                  color='inherit'
                  aria-label="close"
                  onClick={(e) => handleClose()}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            <Box component='div' sx={{overflow: 'auto', height: 'calc(100% - 50px)'}}>

              {(err.severity) &&
                <Stack sx={{width: '100%', mb: 3 }} spacing={1}>
                  <Alert severity={err.severity}>{err.message}</Alert>
                </Stack>
              }

              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveAltIcon />}
                disabled={disabledSubmit()}
                style={{marginTop:20, marginLeft:20, marginBottom:30}}
                onClick={(e) => handleSubmit()}
              >
                登録
              </Button>

              <Box component="div" sx={{ mx: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="company"
                  name="company"
                  label="会社名"
                  value={company}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setCompany(e.target.value)}
                />

                <TextField
                  required
                  fullWidth
                  id="division"
                  name="division"
                  label="部署名"
                  value={division}
                  variant="outlined"
                  size="small"
                  sx={{mt: 3}}
                  inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setDivision(e.target.value)}
                />

                <TextField
                  required
                  fullWidth
                  id="person"
                  name="person"
                  label="担当者名"
                  value={person}
                  variant="outlined"
                  size="small"
                  sx={{mt: 3}}
                  inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setPerson(e.target.value)}
                />

                <TextField
                  required
                  type="email"
                  fullWidth
                  id="email"
                  name="email"
                  label="email"
                  value={email}
                  variant="outlined"
                  size="small"
                  sx={{mt: 3}}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
          <ConfirmDlg confirm={confirm} handleOK={handleSubmitOK} handleCancel={handleSubmitCancel} />
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default ClientNewPage;
