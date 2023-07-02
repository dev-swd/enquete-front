import { useState, useEffect } from 'react';
import { getTest } from '../lib/api/test';

type Props = {
  show: boolean;
}
const TestPage = (props: Props) => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    if(props.show) {
      console.log("useEffect");
      handleGetTest();  
    }
  },[props.show]);

  const handleGetTest = async () => {
    try {
      const res = await getTest();
      setData(res.data.data);
    } catch (e) {
      console.log("API-ERR");
    }
  }

  return (
    <div>
      <div>ページタイトル</div>
      <div>{`data=${data}`}</div>
    </div>
  );
}
export default TestPage;
