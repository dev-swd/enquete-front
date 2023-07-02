import { useState, createContext, useEffect } from 'react';

import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import Loading from '../../common/Loading';
import { getResponse } from '../../../lib/api/enquete';
import { isEmpty } from '../../../lib/common/isEmpty';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
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

const initEnquete = {
  id: null,
  company: "",
  division: "",
  person: "",
  email: "",
  code: "",
  name: "",
  items: []
}
type Item = {
  id: number | null;
  type: string;
  title: string;
  maxLength: number | null;
  items: string;
  value: string;
}
type Enquete = {
  id: number | null;
  company: string;
  division: string;
  person: string;
  email: string;
  code: string;
  name: string;
  items: Item[];
}
type Props = {
  show: boolean;
  id: number | null;
  close: (refresh?: boolean) => void;
}
const ResponseShowPage = (props: Props) => {
  const [enquete, setEnquete] = useState<Enquete>(initEnquete);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.show){
      setIsLoading(true);
      handleGetEnquete();
    }
  }, [props.show]);

  const handleGetEnquete = async () => {
    try {
      const res = await getResponse(props.id);
      setEnquete({
        id: res.data.enquete.id,
        company: res.data.enquete.company,
        division: res.data.enquete.division,
        person: res.data.enquete.person,
        email: res.data.enquete.email,
        code: res.data.enquete.enqueteCode,
        name: res.data.enquete.name,
        items: res.data.items
      });
    } catch (e) {
      setErr({severity: "error", message: "API Error"});
    }
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setEnquete(initEnquete);
    setErr({severity: null, message: ""});
  }

  const searchValue = (v: string, i:number) => {
    if(isEmpty(v)) return false;
    if(enquete.items.length===0) return false;
    let arr = enquete.items[i].value.split(',');
    if(arr.indexOf(v)===-1){
      return false;
    } 
    return true;  
  }

  return (
    <>
      { props.show ? (
        <div className='fullscreen'>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>アンケート回答閲覧</Typography>
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

          <Box component='div' sx={{overflow: 'auto', mt: 1, pt:3, height: 'calc(100% - 60px)'}}>
            <Box component='div' sx={{ mx: 5, height: '100%' }}>

              {(err.severity) &&
                <Stack sx={{width: '100%', mb: 3 }} spacing={1}>
                  <Alert severity={err.severity}>{err.message}</Alert>
                </Stack>
              }

              { enquete.id && 
                <TableContainer component={Paper} sx={{ minWidth: '300px', maxWidth: '500px' }}>
                  <Table sx={{ width: '100%', height: err.severity ? 'calc(100% - 50px)' : '100%', overflow: 'none' }} stickyHeader aria-label="prospects table">
                    <TableBody>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>{enquete.company}</CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>{enquete.division}</CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>{`${enquete.person} 様`}</CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>{`${enquete.email}`}</CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>{`${enquete.code}`}</CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>{`${enquete.name}`}</CustomCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              }

              { enquete.items.map((item,i) => (
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
                        inputProps={{readOnly: true, maxLength: item.maxLength, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                        InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                        value={item.value}
                        
                        />
                    </Box>
                  }
                  { item.type==="１件選択" &&
                    <RadioGroup name="radio-field" sx={{ mx: 2, my: 2 }} value={item.value ?? ""}>
                      { item.items.split(',').map((item, j) => (
                        <FormControlLabel key={`raido-${j}`} value={item} control={<Radio readOnly size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>{item}</Typography>} />
                      ))}
                    </RadioGroup>
                  }
                  { item.type==="複数選択" &&
                    <FormGroup sx={{ mx: 2, my: 2 }}>
                      { item.items.split(',').map((item,j) =>
                        <FormControlLabel 
                          key={`checkbox-${j}`} 
                          control={<Checkbox readOnly checked={searchValue(item, i)} />} 
                          label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{item}</Typography>} 
                        />
                      )}
                    </FormGroup>
                  }
                </Box>
              ))}

              <Box sx={{ height: '10px'}} />
            </Box>
          </Box>
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default ResponseShowPage;
