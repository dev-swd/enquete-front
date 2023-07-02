import './App.css';
import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './components/admin/Dashboard';
import SigninPage from './components/admin/SigninPage';
import SignupPage from './components/admin/SignupPage';
import TemplateIndexPage from './components/admin/Template/TemplateIndexPage';
import EnqueteIndexPage from './components/admin/Enquete/EnqueteIndexPage';
import ClientIndexPage from './components/admin/Client/ClientIndexPage';
import RequestIndexPage from './components/admin/Request/RequestIndexPage';

import EnquetePage from './components/client/EnquetePage';
import ClientSigninPage from './components/client/SigninPage';

const initEnqueteInfo = {
  id: null,
  company: "",
  division: "",
  person: "",
  email: "",
  code: "",
  name: "",
  items: []
}
// コンテキスト
type Item = {
  id: number | null;
  type: string;
  title: string;
  maxLength: number | null;
  items: string;
}
type EnqueteInfo = {
  id: number | null;
  company: string;
  division: string;
  person: string;
  email: string;
  code: string;
  name: string;
  items: Item[];
}
type GlobalContextType = {
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
  enqueteInfo: EnqueteInfo;
  setEnqueteInfo: (enqueteInfo: EnqueteInfo) => void;
  signOut: () => void;
}
export const GlobalContext = createContext<GlobalContextType>({
  isSignedIn: false,
  setIsSignedIn: (isSignedIn) => {},
  enqueteInfo: initEnqueteInfo,
  setEnqueteInfo: (enqueteInfo) => {},
  signOut: () => {}
});
const App: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [enqueteInfo, setEnqueteInfo] = useState<EnqueteInfo>(initEnqueteInfo);

  const Private = ({ children }: { children: React.ReactElement }) => {
    if(isSignedIn){
      return children;
    } else {
      return <Navigate to="/signin" />
    }
  }

  const signOut = () => {
    setIsSignedIn(false);
    setEnqueteInfo(initEnqueteInfo);
  }

  // 画面
  return (
    <Router>
      <GlobalContext.Provider value={{isSignedIn, setIsSignedIn, enqueteInfo, setEnqueteInfo, signOut}}>
        <Routes>
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/signin' element={<SigninPage />} />
          <Route path='/admin/regist' element={<SignupPage />} />
          <Route path='/admin/template' element={<TemplateIndexPage />} />
          <Route path='/admin/enquete' element={<EnqueteIndexPage />} />
          <Route path='/admin/client' element={<ClientIndexPage />} />
          <Route path='/admin/request' element={<RequestIndexPage />} />
          <Route path='/' element={<Private><EnquetePage /></Private>} />
          <Route path='/signin' element={<ClientSigninPage />} />
        </Routes>
      </GlobalContext.Provider>
    </Router>
  );
}
export default App;
