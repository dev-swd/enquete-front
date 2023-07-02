import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cmnProps } from '../../common/cmnConst';
import { AlertType } from '../../common/cmnType';
import Loading from '../../common/Loading';
import { getClients } from '../../../lib/api/enquete';
import ClientNewPage from './ClientNewPage';

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

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  zIndex: 1
});

type Order = 'asc' | 'desc';
type Data = {
  id: number;
  company: string;
  division: string;
  person: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
const ClientIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [datas, setDatas] = useState<Data[]>([]);
  const [dispDatas, setDispDatas] = useState<Data[]>([]);
  const [sortKey, setSortKey] = useState<string>("");
  const [order, setOrder] = useState<Order>('asc');
  const [showNew, setShowNew] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetClients();
  }, [setDatas]);

  const handleGetClients = async () => {
    try {
      const res = await getClients();
      setDatas(res.data.clients);
      setDispDatas(res.data.clients);
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
      if (a[column as keyof Data] > b[column as keyof Data]) {
        return sortRule[nextOrder][0];
      } else if (a[column as keyof Data] < b[column as keyof Data]) {
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
      handleGetClients();
    }
  }

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>宛先</Typography>
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
            宛先追加
          </Button>

        </Box>
      </Box>
      
      <TableContainer component={Paper} sx={{ my: 2, mx: 2, width: 'auto', maxHeight: '80vh' }}>
        <Table sx={{ width: 1250 }} stickyHeader aria-label="clients table">
          <TableHead>
            <TableRow>
              <CustomCell sx={{ width: 50 }}>No.</CustomCell>
              <CustomCell 
                sx={{ width: 500 }}
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
                sx={{ width: 500 }}
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
                  担当者名
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
                <CustomCell>{d.company}</CustomCell>
                <CustomCell>{d.division}</CustomCell>
                <CustomCell>{d.person}</CustomCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Loading isLoading={isLoading} />
      <ClientNewPage show={showNew} close={closeNew} />
    </Box>
  );
}
export default ClientIndexPage;
