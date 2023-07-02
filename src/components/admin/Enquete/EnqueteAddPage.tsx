import { useState, useEffect } from 'react';

import { cmnProps } from '../../common/cmnConst';
import { AlertType } from '../../common/cmnType';
import { isEmpty, isEmptyOrZero } from '../../../lib/common/isEmpty';
import { getTemplates } from '../../../lib/api/enquete';
import EnqueteArea from './EnqueteArea';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
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

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel  from '@mui/lab/TabPanel';

const initData: Data = {
  id: null,
  name: "",
  type: "",
  title: "",
  maxLength: null,
  items: "",
  created_at: null,
  updated_at: null
}
type Data = {
  id: number | null;
  name: string;
  type: string;
  title: string;
  maxLength: number | null;
  items: string;
  created_at: Date | null;
  updated_at: Date | null;
}
type Item = {
  enqueteTemplateId: number | null;
  type: string;
  title: string;
  maxLength: number | null;
  items: string[];
}
type Props = {
  show: boolean;
  i: number;
  close: () => void;
  add: (i:number, item:Item) => void;
}
const EnqueteAddPage = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enqueteTemplateId, setEnqueteTemplateId] = useState<number | null>(null);
  const [type, setType] = useState<string>("テキスト入力");
  const [title, setTitle] = useState<string>("");
  const [maxLength, setMaxLength] = useState<number>(50);
  const [items, setItems] = useState<string[]>([]);
  const [value, setValue] = useState<string>("0");
  const [datas, setDatas] = useState<Data[]>([]);
  const [targetData, setTargetData] = useState<Data>(initData);
  const [targetItems, setTargetItems] = useState<string[]>([]);

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetTemplates();
  }, [props.show]);

  const handleGetTemplates = async () => {
    try {
      const res = await getTemplates();
      setDatas(res.data.templates);
    } catch (e) {
      setErr({severity: "error", message: "API Error"});
    }
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setEnqueteTemplateId(null);
    setType("テキスト入力");
    setTitle("");
    setMaxLength(50);
    setItems([]);
    setValue("0");
    setDatas([]);
    setTargetData(initData);
    setTargetItems([]);
  }
  
  // 追加
  const handleSubmit = () => {
//    const params: Item = {
//      enqueteTemplateId: null,
//      type: type,
//      title: title,
//      maxLength: maxLength,
//      items: items,
//    }
    let params: Item;
    if(value==="0"){
      params = {
        enqueteTemplateId: null,
        type: type,
        title: title,
        maxLength: maxLength,
        items: items,
      }
    } else {
      params = {
        enqueteTemplateId: targetData.id,
        type: targetData.type,
        title: targetData.title,
        maxLength: targetData.maxLength,
        items: targetItems,
      }
    }
    props.add(props.i, params);
    handleClose();
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
    const tmpItems = [...items];
    tmpItems[items.length] = "";
    setItems(tmpItems);
  }

  // MoveUp処理
  const handleMoveUp = (i: number) => {
    if (i !== 0) {
      let _tmpItems = items.slice(0, i-1);
      let _tmpItem = items[i-1];
      let tmpItem = items[i];
      let tmpItems_ = items.slice(i+1);

      let tmpItems = _tmpItems.concat(tmpItem, _tmpItem, tmpItems_);
      setItems(tmpItems);
    }
  }

  // MoveDown処理
  const handleMoveDown = (i: number) => {
    if (i !== (items.length - 1)) {
      let _tmpItems = items.slice(0, i);
      let tmpItem = items[i];
      let tmpItem_ = items[i+1];
      let tmpItems_ = items.slice(i+2);

      let tmpItems = _tmpItems.concat(tmpItem_, tmpItem, tmpItems_);
      setItems(tmpItems);
    }
  }

  // Delete処理
  const handleDelete = (i: number) => {
    const tmpItems = [...items];
    tmpItems.splice(i,1);
    setItems(tmpItems);
  }

  // 入力時処理
  const handleChangeItemName= (i: number, value: string) => {
    const tmpItems = [...items];
    tmpItems[i] = value;
    setItems(tmpItems);
  }

  // 追加ボタン非活性
  const disabledSubmit = () => {
    if(isEmpty(type) || isEmpty(title)) return true;

    if(type==="テキスト入力") {
      if(isEmptyOrZero(maxLength)) return true;
    } else {
      if(items.length===0) return true;
      let err:boolean = false;
      items.forEach((item,i) => {
        if(isEmpty(item)){
          err = true;
        }
      });
      return err; 
    }
    return false;
  }

  // テンプレート表示
  const handleDisplay = () => {
    let selectData = datas.find((d) => d.id === enqueteTemplateId);
    setTargetData(selectData || initData);
    if(!isEmpty(selectData?.items)){
      let tmpItems = selectData?.items.split(',');
      setTargetItems(tmpItems ?? []);  
    } else {
      setTargetItems([]);  
    }
  }

  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '90%', width: '60vw', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>質問追加</Typography>
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

              <TabContext value={value}>
                <TabList onChange={(e, v) => setValue(v)}>
                  <Tab label="オリジナル作成" value="0" />
                  <Tab label="テンプレート選択" value="1" />
                </TabList>
                <TabPanel value="0">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<SaveAltIcon />}
                    disabled={disabledSubmit()}
                    sx={{ ml: 2 }}
                    onClick={(e) => handleSubmit()}
                  >
                    追加
                  </Button>
                
                  <Box component="div" sx={{ mt: 5, mx: 2 }}>
                    <Box component="div">
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
                          <MenuItem key={`type-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value="複数選択">複数選択</MenuItem>
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
                            { items.map((item, i) => (
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
                                  <IconButton aria-label="move-down" onClick={() => handleMoveDown(i)} disabled={(i === (items.length-1)) ? true : false }>
                                    {(i === (items.length-1)) ? (
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
                </TabPanel>
                <TabPanel value="1">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<SaveAltIcon />}
                    disabled={isEmpty(targetData.id)}
                    sx={{ ml: 2 }}
                    onClick={(e) => handleSubmit()}
                  >
                    追加
                  </Button>
                  
                  <Box component="div" sx={{ mt: 5, mx: 2 }}>
                    <Box component="div" sx={{ display: 'flex' }}>
                      <FormControl variant="outlined" sx={{width: '80%' }} size="small" required>
                        <InputLabel id="select-template-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>テンプレート</InputLabel>
                        <Select
                          labelId="select-template-label"
                          id="select-template"
                          label="テンプレート"
                          value={enqueteTemplateId ?? ''}
                          onChange={(e) => setEnqueteTemplateId(Number(e.target.value))}
                          sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                        >
                          { datas.map((d,i) => (
                            <MenuItem key={`template-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={d.id ?? ''}>{d.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ ml: 2 }}
                        onClick={(e) => handleDisplay()}
                      >
                        表示
                      </Button>
                    </Box>
                    <Box sx={{ mt: 5 }}>
                      { targetData.id && <EnqueteArea type={targetData.type} title={targetData.title} maxLength={targetData.maxLength} items={targetItems} />}
                    </Box>

                  </Box>
                </TabPanel>
              </TabContext>

            </Box>
          </Box>
        </div>
      ) : (
        <></>
      )}
    </>    
  )
}
export default EnqueteAddPage;
