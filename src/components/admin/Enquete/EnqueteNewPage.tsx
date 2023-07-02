import { useState } from 'react';

import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import EnqueteArea from './EnqueteArea';
import EnqueteAddPage from './EnqueteAddPage';
import { isEmpty } from '../../../lib/common/isEmpty';
import { addEnquete, addEnqueteParams, addEnqueteItemParams } from '../../../lib/api/enquete';

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
import AddCircleIcon from '@mui/icons-material/AddCircle';

type Item = {
  enqueteTemplateId: number | null;
  type: string;
  title: string;
  maxLength: number | null;
  items: string[];
}
type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const EnqueteNewPage = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [addIndex, setAddIndex] = useState<number>(0);
  const [itemParams, setItemParams] = useState<addEnqueteItemParams[]>([]);

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setName("");
    setDescription("");
    setItems([]);
    setItemParams([]);
    setErr({severity: null, message: ""});
  }

  // 登録
  const handleSubmit = () => {
    let tmpItemParams:addEnqueteItemParams[] = items.map((item,i) => {
      const tmpItem: addEnqueteItemParams = {
        enqueteTemplateId: null,
        type: item.type,
        title: item.title,
        maxLength: item.maxLength,
        items: item.items.join(','),  
      }
      return tmpItem;
    })
    setItemParams(tmpItemParams);
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
    const params:addEnqueteParams = {
      name: name,
      description: description,
      items: itemParams
    }
    try {
      const res = await addEnquete(params);
      if (res.data.status === "200") {
        props.close(true);
        setName("");
        setDescription("");
        setItems([]);
        setItemParams([]);
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

  // 質問追加画面表示
  const handleClickAdd = (i: number) => {
    setAddIndex(i);
    setShowAdd(true);
  }

  // 質問追加
  const handleAdd = (i: number, item: Item) => {
    if(items.length === 0) {
      let tmpItems = [...items];
      tmpItems.push(item);
      setItems(tmpItems);
    } else {
      if(i===0){
        let tmpItems = [item].concat(items);
        setItems(tmpItems);
      } else {
        if(i===items.length){
          let tmpItems = [...items];
          tmpItems.push(item);
          setItems(tmpItems);
        } else {
          let _tmpItems = items.slice(0, i);
          let tmpItems_ = items.slice(i);
          let tmpItems = _tmpItems.concat([item], tmpItems_);
          setItems(tmpItems);    
        }
      }
    }
  }

  // 質問追加画面終了
  const closeAdd = () => {
    setShowAdd(false);
    setAddIndex(0);
  }

  // 登録ボタン非活性
  const disabledSubmit = () => {
    if(isEmpty(name) || isEmpty(description) || items.length===0) return true;
  }

  return (
    <>
      { props.show ? (
        <div className='fullscreen'>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>アンケート作成</Typography>
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

          <Box component='div' sx={{overflow: 'auto', pt:3, mx: 5, height: 'calc(100% - 50px)'}}>

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
              sx={{ mb: 3 }}
              onClick={(e) => handleSubmit()}
            >
              登録
            </Button>

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

            <TextField
              required
              fullWidth
              multiline
              rows={5}
              id="description"
              name="description"
              label="概要"
              value={description}
              variant="outlined"
              size="small"
              sx={{mt: 3}}
              inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setDescription(e.target.value)}
            />

            { items.map((item,i) => (
              <Box key={`item-${i}`}>
                <div className='add-bar'>
                  <hr />
                  <AddCircleIcon className='icon' onClick={() => handleClickAdd(i)} />
                  <hr />
                </div>
                <EnqueteArea type={item.type} title={item.title} maxLength={item.maxLength} items={item.items} />
              </Box>
            ))}
            
            <div className='add-bar'>
              <hr />
              <AddCircleIcon className='icon' onClick={() => handleClickAdd(items.length)} />
              <hr />
            </div>
          </Box>
          <EnqueteAddPage show={showAdd} i={addIndex} close={closeAdd} add={handleAdd} />
          <ConfirmDlg confirm={confirm} handleOK={handleSubmitOK} handleCancel={handleSubmitCancel} />
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default EnqueteNewPage;
