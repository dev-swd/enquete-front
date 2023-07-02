import { useState } from 'react';

import { addTemplateParams, addTemplate } from '../../../lib/api/enquete';
import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import { isEmpty, isEmptyOrZero } from '../../../lib/common/isEmpty';

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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import DeleteIcon from "@mui/icons-material/Delete";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const TemplateNewPage = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("テキスト入力");
  const [title, setTitle] = useState<string>("");
  const [maxLength, setMaxLength] = useState<number>(50);
  const [items, setItems] = useState<string>("");
  const [itemRows, setItemRows] = useState<string[]>([]);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setName("");
    setType("テキスト入力");
    setTitle("");
    setMaxLength(50);
    setItems("");
    setItemRows([]);
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
    saveTemplate();
  }

  // 登録処理
  const saveTemplate = async () => {
    let params:addTemplateParams;
    if(type==="テキスト入力"){
      params = {
        name: name,
        type: type,
        title: title,
        maxLength: maxLength,
        items: ""
      }
    } else {
      params = {
        name: name,
        type: type,
        title: title,
        maxLength: itemRows.length,
        items: itemRows.join(',')
      }
    }
    try {
      const res = await addTemplate(params);
      if (res.data.status === "200") {
        props.close(true);
        setName("");
        setType("テキスト入力");
        setTitle("");
        setMaxLength(50);
        setItems("");
        setItemRows([]);
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

  // 最大文字数入力桁制限
  const handleChangeMaxLength = (v: string) => {
    console.log(v);
    if(v.length > 5) {
//      return v.slice(0, 5);
      return maxLength;
    }
    return v;
  }

  // 追加ボタン押下時の処理
  const handleAdd = () => {
    const tmpItemRows = [...itemRows];
    tmpItemRows[itemRows.length] = "";
    setItemRows(tmpItemRows);
  }

  // MoveUp処理
  const handleMoveUp = (i: number) => {
    if (i !== 0) {
      let _tmpItemRows = itemRows.slice(0, i-1);
      let _tmpItemRow = itemRows[i-1];
      let tmpItemRow = itemRows[i];
      let tmpItemRows_ = itemRows.slice(i+1);

      let tmpItemRows = _tmpItemRows.concat(tmpItemRow, _tmpItemRow, tmpItemRows_);
      setItemRows(tmpItemRows);
    }
  }

  // MoveDown処理
  const handleMoveDown = (i: number) => {
    if (i !== (itemRows.length - 1)) {
      let _tmpItemRows = itemRows.slice(0, i);
      let tmpItemRow = itemRows[i];
      let tmpItemRow_ = itemRows[i+1];
      let tmpItemRows_ = itemRows.slice(i+2);

      let tmpItemRows = _tmpItemRows.concat(tmpItemRow_, tmpItemRow, tmpItemRows_);
      setItemRows(tmpItemRows);
    }
  }

  // Delete処理
  const handleDelete = (i: number) => {
    const tmpItemRows = [...itemRows];
    tmpItemRows.splice(i,1);
    setItemRows(tmpItemRows);
  }

  // 入力時処理
  const handleChangeItemName= (i: number, value: string) => {
    const tmpItemRows = [...itemRows];
    tmpItemRows[i] = value;
    setItemRows(tmpItemRows);
  }

  // 登録ボタン非活性
  const disabledSubmit = () => {
    if(isEmpty(name) || isEmpty(type) || isEmpty(title)) return true;

    if(type==="テキスト入力") {
      if(isEmptyOrZero(maxLength)) return true;
    } else {
      if(itemRows.length===0) return true;
      let err:boolean = false;
      itemRows.forEach((itemRow,i) => {
        if(isEmpty(itemRow)){
          err = true;
        }
      });
      return err; 
    }
    return false;
  }

  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '90%', width: '60vw', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>質問テンプレート追加</Typography>
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
                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="名称"
                  value={name}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setName(e.target.value)}
                />

                <Box component="div" sx={{mt: 3}}>
                  <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel id="select-type-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>タイプ</InputLabel>
                    <Select
                      labelId="select-type-label"
                      id="select-type"
                      label="タイプ"
                      value={type ?? ''}
                      onChange={(e) => setType(e.target.value)}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                    >
                      <MenuItem key={`type-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value="テキスト入力">テキスト入力</MenuItem>
                      <MenuItem key={`type-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value="１件選択">１件選択</MenuItem>
                      <MenuItem key={`type-3`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value="複数選択">複数選択</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  required
                  fullWidth
                  multiline
                  rows={5}
                  id="title"
                  name="title"
                  label="タイトル"
                  value={title}
                  variant="outlined"
                  size="small"
                  sx={{mt: 3}}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setTitle(e.target.value)}
                />

                { type==="テキスト入力" ? (
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="maxLength"
                    name="maxLength"
                    label="最大文字数"
                    value={String(maxLength)}
                    variant="outlined"
                    size="small"
                    sx={{mt: 3}}
                    inputProps={{maxLength:5, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setMaxLength(Number(handleChangeMaxLength(e.target.value)))}
                  />
                ) : (
                  <Box component='div' sx={{ mt: 3, mb: 3, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
                    <Table sx={{ width: '100%' }}>
                      <TableBody>
                        { itemRows.map((item, i) => (
                          <TableRow>
                            <TableCell sx={{ width: 'auto' }}>
                              <TextField
                                required
                                fullWidth
                                id={`item-name-${i}`}
                                name="item-name"
                                label="選択"
                                value={item}
                                variant="outlined"
                                size="small"
                                inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                                InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                                onChange={(e) => handleChangeItemName(i, e.target.value)}
                              />
                            </TableCell>
                            <TableCell sx={{ width: 180 }}>
                              <IconButton aria-label="move-up" onClick={() => handleMoveUp(i)} disabled={(i === 0) ? true : false }>
                                {(i === 0) ? (
                                  <MoveUpIcon color="disabled" fontSize="inherit" />
                                ) : (
                                  <MoveUpIcon color="primary" fontSize="inherit" />
                                )}
                              </IconButton>
                              <IconButton aria-label="move-down" onClick={() => handleMoveDown(i)} disabled={(i === (itemRows.length-1)) ? true : false }>
                                {(i === (itemRows.length-1)) ? (
                                  <MoveDownIcon color="disabled" fontSize="inherit" />
                                ) : (
                                  <MoveDownIcon color="primary" fontSize="inherit" />
                                )}
                              </IconButton>
                              <IconButton aria-label="delete" onClick={() => handleDelete(i)}>
                                <DeleteIcon color="primary" fontSize="inherit" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Box sx={{ textAlign: 'center' }}>
                      <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAdd()}>
                        <AddCircleIcon sx={{ fontSize : 40 }} />
                      </IconButton>
                    </Box>
                  </Box>  
                )}
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
export default TemplateNewPage;
