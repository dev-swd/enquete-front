import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cmnProps } from '../../common/cmnConst';
import { AlertType } from '../../common/cmnType';
import { getRequests } from '../../../lib/api/enquete';
import Loading from '../../common/Loading';
import RequestNewPage from './RequestNewPage';
import { nvl } from '../../../lib/common/isEmpty';
import { formatDateZero } from '../../../lib/common/dateCom';
import ResponseShowPage from './ResponseShowPage';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableSortLabel from '@mui/material/TableSortLabel';
import PostAddIcon from '@mui/icons-material/PostAdd';
import IconButton from '@mui/material/IconButton';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PageviewIcon from '@mui/icons-material/Pageview';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  zIndex: 1
});

type Order = 'asc' | 'desc';
type Data = {
  company: string;
  division: string;
  person: string;
  email: string;
  name: string;
  description: string;
  id: number;
  clientId: number;
  enqueteId: number;
  enqueteCode: string;
  requestedDate: Date | null;
  responseDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
const RequestIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [datas, setDatas] = useState<Data[]>([]);
  const [dispDatas, setDispDatas] = useState<Data[]>([]);
  const [sortKey, setSortKey] = useState<string>("");
  const [order, setOrder] = useState<Order>('asc');
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showRes, setShowRes] = useState<boolean>(false);
  const [resId, setResId] = useState<number | null>(null);

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetRequests();
  }, [setDatas]);

  const handleGetRequests = async () => {
    try {
      const res = await getRequests();
      setDatas(res.data.requests);
      setDispDatas(res.data.requests);
    } catch (e) {
      setErr({severity: "error", message: "API Error"});
    }
    setIsLoading(false);
  }

  // 一覧ヘッダクリック時の処理
  const handleClickSortColumn = (column: string) => {
    // 未選択の列をクリックした場合は、その列で降順に設定
    // 選択中の列をクリックした場合は昇順／降順の切り替え
    const isDesc = column===sortKey && order==="desc";
    const nextOrder = isDesc ? "asc" : "desc";
    const sortRule = { asc: [1, -1], desc: [-1, 1] };
    const sortedData = datas.slice().sort((a,b) => {
      if (nvl(a[column as keyof Data],"") > nvl(b[column as keyof Data],"")) {
        return sortRule[nextOrder][0];
      } else if (nvl(a[column as keyof Data],"") < nvl(b[column as keyof Data],"")) {
        return sortRule[nextOrder][1];
      } else {
        return 0;
      }
    });
    setDispDatas(sortedData);
    setOrder(nextOrder);
    setSortKey(column);
  }

  // 新規作成画面終了
  const closeNew = (refresh?: boolean) => {
    setShowNew(false);
    if(refresh){
      setIsLoading(true);
      handleGetRequests();
    }
  }

  // 回答参照
  const handleShowResponse = (id: number) => {
    setResId(id);
    setShowRes(true);
  }

  // 回答参照画面終了
  const closeResponse = (refresh?: boolean) => {
    setResId(null);
    setShowRes(false);
  }

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>アンケート依頼</Typography>
            <IconButton
              size="medium"
              edge="end"
              color='inherit'
              aria-label="dashboard"
              onClick={() => navigate('/admin')}
            >
              <DashboardIcon fontSize='inherit' />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1}>
          <Alert severity={err.severity}>{err.message}</Alert>
        </Stack>
      }

      <Box component='div' sx={{ my: 3, mx: 2, width: 'auto', display: 'flex', justifyContent: 'space-between' }}>
        <Box component='div'>
          <Button 
            variant="contained"
            color="primary"
            size="small"
            startIcon={<PostAddIcon />}
            onClick={(e) => setShowNew(true)}
          >
            アンケート依頼追加
          </Button>

        </Box>
      </Box>
      
      <TableContainer component={Paper} sx={{ my: 2, mx: 2, width: 'auto', maxHeight: '80vh' }}>
        <Table sx={{ width: 2250 }} stickyHeader aria-label="templates table">
          <TableHead>
            <TableRow>
              <CustomCell sx={{ width: 50 }}>No.</CustomCell>
              <CustomCell sx={{ width: 100 }}>詳細</CustomCell>
              <CustomCell 
                sx={{ width: 300 }}
                sortDirection={sortKey==="company" ? order : false} 
              >
                <TableSortLabel 
                  active={sortKey === "company"}
                  direction={order}
                  onClick={() => handleClickSortColumn("company")}
                >
                  会社名
                </TableSortLabel>
              </CustomCell>
              <CustomCell 
                sx={{ width: 300 }}
                sortDirection={sortKey==="division" ? order : false} 
              >
                <TableSortLabel 
                  active={sortKey === "division"}
                  direction={order}
                  onClick={() => handleClickSortColumn("division")}
                >
                  部署名
                </TableSortLabel>
              </CustomCell>
              <CustomCell 
                sx={{ width: 200 }}
                sortDirection={sortKey==="person" ? order : false} 
              >
                <TableSortLabel 
                  active={sortKey === "person"}
                  direction={order}
                  onClick={() => handleClickSortColumn("person")}
                >
                  担当者
                </TableSortLabel>
              </CustomCell>
              <CustomCell 
                sx={{ width: 200 }}
                sortDirection={sortKey==="email" ? order : false} 
              >
                <TableSortLabel 
                  active={sortKey === "email"}
                  direction={order}
                  onClick={() => handleClickSortColumn("email")}
                >
                  email
                </TableSortLabel>
              </CustomCell>
              <CustomCell 
                sx={{ width: 500 }}
                sortDirection={sortKey==="name" ? order : false} 
              >
                <TableSortLabel 
                  active={sortKey === "name"}
                  direction={order}
                  onClick={() => handleClickSortColumn("name")}
                >
                  アンケート名
                </TableSortLabel>
              </CustomCell>
              <CustomCell 
                sx={{ width: 200 }}
                sortDirection={sortKey==="enqueteCode" ? order : false} 
              >
                <TableSortLabel 
                  active={sortKey === "enqueteCode"}
                  direction={order}
                  onClick={() => handleClickSortColumn("enqueteCode")}
                >
                  アンケートコード
                </TableSortLabel>
              </CustomCell>
              <CustomCell 
                sx={{ width: 200 }}
                sortDirection={sortKey==="requestedDate" ? order : false} 
              >
                <TableSortLabel 
                  active={sortKey === "requestedDate"}
                  direction={order}
                  onClick={() => handleClickSortColumn("requestedDate")}
                >
                  依頼日
                </TableSortLabel>
              </CustomCell>
              <CustomCell 
                sx={{ width: 200 }}
                sortDirection={sortKey==="responseDate" ? order : false} 
              >
                <TableSortLabel 
                  active={sortKey === "responseDate"}
                  direction={order}
                  onClick={() => handleClickSortColumn("responseDate")}
                >
                  回答日
                </TableSortLabel>
              </CustomCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { dispDatas.map((d,i) => (
              <TableRow
                key={`row-${i}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <CustomCell align='right'>{i+1}</CustomCell>
                <CustomCell>
                  { d.responseDate && 
                    <IconButton aria-label="Page View"  onClick={() => handleShowResponse(d.id)}>
                      <PageviewIcon color="primary" fontSize='inherit' />
                    </IconButton>
                  }
                </CustomCell>
                <CustomCell>{d.company}</CustomCell>
                <CustomCell>{d.division}</CustomCell>
                <CustomCell>{d.person}</CustomCell>
                <CustomCell>{d.email}</CustomCell>
                <CustomCell>{d.name}</CustomCell>
                <CustomCell>{d.enqueteCode}</CustomCell>
                <CustomCell>{formatDateZero(d.requestedDate, "YYYY年MM月DD日")}</CustomCell>
                <CustomCell>{formatDateZero(d.responseDate, "YYYY年MM月DD日")}</CustomCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Loading isLoading={isLoading} />
      <RequestNewPage show={showNew} close={closeNew} />
      <ResponseShowPage show={showRes} id={resId} close={closeResponse} />
    </Box>
  );
}
export default RequestIndexPage;
