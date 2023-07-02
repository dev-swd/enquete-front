import React, { useState, useEffect, useContext } from 'react';

import { GlobalContext } from '../../App';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import ConfirmDlg, { ConfirmParam } from '../common/ConfirmDlg';
import Loading from '../common/Loading';
import { writeEnquete, EnqueteItemParams, EnqueteParams } from '../../lib/api/enquete';
import { isEmpty } from '../../lib/common/isEmpty';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  zIndex: 1
});

const EnquetePage: React.FC = () => {
  const { enqueteInfo, signOut, setEnqueteInfo } = useContext(GlobalContext);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    let tmpValues:string[] = [];
    enqueteInfo.items.forEach((item, i) => {
      tmpValues[i] = "";
    });
    setValues(tmpValues);
  }, [setValues]);

  // 登録
  const handleSubmit = () => {
    console.log(values);
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
    saveEnquete();
  }

  // 登録処理
  const saveEnquete = async () => {
    try {
      const itemParams: EnqueteItemParams[] = enqueteInfo.items.map((item, i) => {
        const tmpItem: EnqueteItemParams = {
          enqueteItemId: item.id,
          value: values[i],
        }
        return tmpItem;
      });
      const params: EnqueteParams = {
        requestId: enqueteInfo.id,
        items: itemParams,
      }
        const res = await writeEnquete(params);
      if (res.data.status === "200") {
        signOut();
        setValues([]);
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

  // アンケート入力(text or radio)
  const handleChange = (v: string, i: number) => {
    let tmpValues = [...values];
    tmpValues[i] = v;
    setValues(tmpValues);
  }

  // アンケート入力(checkbox)
  const handleChangeCheckbox = (v: string, i: number) => {
    if(isEmpty(v)) return;
    if(values.length===0) return;
    let arr = values[i].split(',');
    let index = arr.indexOf(v);
    if(index===-1){
      let arr = values[i].split(',');
      arr.push(v);
      let tmpValues = [...values];
      tmpValues[i] = arr.join(',');
      setValues(tmpValues);        
    } else {
      let arr2 = arr.splice(index, 1);
      let tmpValues = [...values];
      tmpValues[i] = arr.join(',');
      setValues(tmpValues);        
    }
  }
  const searchValue = (v: string, i:number) => {
    if(isEmpty(v)) return false;
    if(values.length===0) return false;
    let arr = values[i].split(',');
    if(arr.indexOf(v)===-1){
      return false;
    } 
    return true;  
  }

  return (
    <Box component='div' sx={{ height: '100vh', backgroundColor: '#fff', overflow: 'hidden' }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar variant="dense">
            <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>{enqueteInfo.name}</Typography>
            <IconButton
              size="medium"
              edge="end"
              color='inherit'
              aria-label="signin"
              onClick={() => signOut()}
            >
              <LogoutIcon fontSize='inherit' />
          </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Box component='div' sx={{overflow: 'auto', mt: 1, pt:3, height: 'calc(100% - 60px)'}}>
        <Box component='div' sx={{ mx: 5, height: '100%' }}>

          {(err.severity) &&
            <Stack sx={{width: '100%', mb: 3 }} spacing={1}>
              <Alert severity={err.severity}>{err.message}</Alert>
            </Stack>
          }

          <TableContainer component={Paper} sx={{ minWidth: '300px', maxWidth: '500px' }}>
            <Table sx={{ width: '100%', height: err.severity ? 'calc(100% - 50px)' : '100%', overflow: 'none' }} stickyHeader aria-label="prospects table">
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <CustomCell>{enqueteInfo.company}</CustomCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <CustomCell>{enqueteInfo.division}</CustomCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <CustomCell>{`${enqueteInfo.person} 様`}</CustomCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          { enqueteInfo.items.map((item,i) => (
            <Box component='div' key={`item-${i}`} sx={{ my: 5, width: '100%', border: 'solid 2px #c9c9c9', borderRadius: '4px' }}>
              <Typography variant='caption' component="div" sx={{ ml: 1, mt: 1, fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{item.title}</Typography>
              {item.type==="テキスト入力" &&
                <Box mx={2} my={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    name="text-field"
                    variant="outlined"
                    size="small"
                    inputProps={{maxLength: item.maxLength, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => handleChange(e.target.value, i)}
                    value={values[i]}
                    />
                </Box>
              }
              { item.type==="１件選択" &&
                <RadioGroup name="radio-field" sx={{ mx: 2, my: 2 }} onChange={(e) => handleChange(e.target.value, i)} value={values[i] ?? ""}>
                  { item.items.split(',').map((item, j) => (
                    <FormControlLabel key={`raido-${j}`} value={item} control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>{item}</Typography>} />
                  ))}
                </RadioGroup>
              }
              { item.type==="複数選択" &&
                <FormGroup sx={{ mx: 2, my: 2 }}>
                  { item.items.split(',').map((item,j) =>
                    <FormControlLabel 
                      key={`checkbox-${j}`} 
                      control={<Checkbox checked={searchValue(item, i)} onChange={(e) => handleChangeCheckbox(item, i)} />} 
                      label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{item}</Typography>} 
                    />
                  )}
                </FormGroup>
              }
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            sx={{ mb: 3 }}
            onClick={(e) => handleSubmit()}
          >
            回答
          </Button>

        </Box>
        <Loading isLoading={isLoading} />
        <ConfirmDlg confirm={confirm} handleOK={handleSubmitOK} handleCancel={handleSubmitCancel} />
      </Box>
    </Box>
  )
}
export default EnquetePage;
