// 未設定チェック共通処理

// ノーマルタイプ
export const isEmpty = (v: any) => {
  if(v===undefined || v===null || v==="") {
    return true;
  } else {
    return false;
  }
}

// 0も未設定判定
export const isEmptyOrZero = (v: any) => {
  if(v===undefined || v===null || v==="" || v===0) {
    return true;
  } else {
    return false;
  }
}

// 未設定の場合に""を返却する
export const isEmptyRet = (v: any): string => {
  if(isEmpty(v)){
    return "";
  } else {
    return v;
  }
}

// null置換関数
export const nvl = (v1:any, v2:string): any => {
  return (v1 == null)? v2 : v1;
}
