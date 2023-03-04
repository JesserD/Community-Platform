import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../features/conversations/Dashboard';
import HomePage from '../../features/home/HomePage';
import ModalContainer from '../common/modals/ModalContainer';
import { useStore } from '../stores/store';
import Navigator from './Navigator';

const App = () => {
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) userStore.getUser().finally(() => commonStore.setAppLoaded());
    else commonStore.setAppLoaded();
  }, [commonStore, userStore]);

  //if (!commonStore.appLoaded) return (<LoadingComponent message='Loading app' />);

  return (
    <>
      <ModalContainer />
      <Navigator />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default observer(App);
