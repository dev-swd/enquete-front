import { useState, useEffect } from 'react';

import { addRequestParams, addRequest, getClients, getEnquetes } from '../../../lib/api/enquete';
import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import { isEmpty } from '../../../lib/common/isEmpty';
import { hankakuOnly } from '../../../lib/common/inputRegulation';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";

type Client = {
  id: number;
  company: string;
  division: string;
  person: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
type Enquete = {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const RequestNewPage = (props: Props) => {
  const [clientId, setClientId] = useState<number | null>(null)
  const [enqueteId, setEnqueteId] = useState<number | null>(null);
  const [enqueteCode, setEnqueteCode] = useState<string>("");
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [enquetes, setEnquetes] = useState<Enquete[]>([]);

  // 初期処理
  useEffect(() => {
    if(props.show){
      setIsLoading(true);
      handleGetList();  
    }
  }, [props.show]);

  const handleGetList = async () => {
    try {
      const res1 = await getClients();
      setClients(res1.data.clients);
      const res2 = await getEnquetes();
      setEnquetes(res2.data.enquetes);
    } catch (e) {
      setErr({severity: "error", message: "API Error"});
    }
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setClientId(null);
    setEnqueteId(null);
    setEnqueteCode("");
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
    saveRequest();
  }

  // 登録処理
  const saveRequest = async () => {
    const params: addRequestParams = {
      clientId: clientId,
      enqueteId: enqueteId,
      enqueteCode: enqueteCode
    }
    try {
      const res = await addRequest(params);
      if (res.data.status === "200") {
        props.close(true);
        setClientId(null);
        setEnqueteId(null);
        setEnqueteCode("");
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
    if(isEmpty(clientId) || isEmpty(enqueteId) || isEmpty(enqueteCode)) return true;
    return false;
  }

  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '90%', width: '60vw', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>アンケート依頼追加</Typography>
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
                <Stack sx={{width: '100%'}} spacing={1}>
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
                <Box component="div" sx={{mt: 3}}>
                  <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel id="select-client-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>宛先</InputLabel>
                    <Select
                      labelId="select-client-label"
                      id="select-client"
                      label="宛先"
                      value={clientId ?? ''}
                      onChange={(e) => setClientId(Number(e.target.value))}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                    >
                      { clients.map((c,i) => (
                        <MenuItem key={`client-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={c.id}>{`${c.company}　${c.division}　${c.person}`}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box component="div" sx={{mt: 3}}>
                  <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel id="select-enquete-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>アンケート</InputLabel>
                    <Select
                      labelId="select-enquete-label"
                      id="select-enquete"
                      label="アンケート"
                      value={enqueteId ?? ''}
                      onChange={(e) => setEnqueteId(Number(e.target.value))}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                    >
                      { enquetes.map((e,i) => (
                        <MenuItem key={`enquete-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={e.id}>{e.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  required
                  fullWidth
                  id="enqueteCode"
                  name="enqueteCode"
                  label="アンケートコード"
                  value={enqueteCode}
                  variant="outlined"
                  size="small"
                  sx={{mt: 3}}
                  inputProps={{maxLength:10, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setEnqueteCode(hankakuOnly(e.target.value))}
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
export default RequestNewPage;
