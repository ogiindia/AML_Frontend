/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingComponent, Toaster } from '@ais/components';
import { convertToMultiLevel } from '@ais/utils';
import { ConfigProvider, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import './App.css';
import { removeNotification } from './redux/notifySlice';
import logo from './static/logo.png';
import { useGlobalContext } from './utilites/Contexts/GlobalContext';
import { usePage } from './utilites/Contexts/PageContext';
function HOC({ children }) {
  const { globalState, updateGlobalState } = useGlobalContext();
  const { page, setCurrentMenu, updateModuleList } = usePage();
  const [loading, setLoading] = useState(false);

  const notify = useSelector((state) => state.notify);
  const dispatch = useDispatch();

  useEffect(() => {
    updateGlobalState({
      page: 'page',
      welcomeMsg: 'welcome',
    });
  }, []);

  useEffect(() => {
    console.log(globalState.module_key);
    if (globalState.module_key) {
      console.log(page.convertedMenu);
      console.log(
        convertToMultiLevel(
          page.convertedMenu[globalState.module_key],
          'id',
          'parentMenuID',
        ),
      );
      setCurrentMenu(
        convertToMultiLevel(
          page.convertedMenu[globalState.module_key],
          'id',
          'parentMenuID',
        ),
      );
    }
  }, [globalState.module_key]);

  useEffect(() => {
    if (page.convertedMenu != null) {
      const menuData = page.convertedMenu;
      const modulesList = globalState.moduleKeyList;
      console.log(menuData);
      Object.keys(menuData).forEach((menu, i) => {
        if (i === 0) {
          updateGlobalState({
            module_name: modulesList[menu],
            module_key: menu,
          });
          setCurrentMenu(
            convertToMultiLevel(menuData[menu], 'id', 'parentMenuID'),
          );
        }

        var tempJson = {
          [menu]: modulesList[menu],
        };

        updateModuleList(tempJson);
      });
    }
  }, [page.convertedMenu]);

  const onClose = (id) => {
    dispatch(removeNotification(id));
  };
  useEffect(() => {
    if (notify.length > 0) {
      notify.map((data) => {
        notification[data.type]({
          message: data.title,
          description: data.desc,
          onClose: onClose(data.id),
        });
        return null;
      });
    }
  }, [notify]);

  useEffect(() => {
    setLoading(globalState.loading);
    console.warn(
      'runs everytime when a loading is set / unset status : ' + loading,
    );

    setTimeout(() => {
      updateGlobalState({
        loading: false,
      });
    }, 5000);
  }, [globalState.loading]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary:
            globalState.appPrimaryColor !== undefined &&
              globalState.appPrimaryColor !== null
              ? globalState.appPrimaryColor
              : '#8DC63F',
          colorSecondary:
            globalState.appSecondaryColor !== undefined &&
              globalState.appSecondaryColor != null
              ? globalState.appSecondaryColor
              : '#4bcd3e',
        },
      }}
    >
      <div className="App">
        <div className="full-layout">
          {loading ? (
            <>
              {' '}
              <LoadingComponent show={loading}>
                <img src={logo} alt="logo" style={{ height: '100px' }} />
                <div
                  className="spinner-grow text-success spinner-grow-sm"
                  role="status"
                >
                  <span className="visually-hidden"></span>
                </div>
                &nbsp;
                <div
                  className="spinner-grow fis-secondary spinner-grow-sm"
                  role="status"
                >
                  <span className="visually-hidden"></span>
                </div>
                &nbsp;
                <div
                  className="spinner-grow fis-primary spinner-grow-sm"
                  role="status"
                >
                  <span className="visually-hidden"></span>
                </div>
                <div>
                  &nbsp;
                  <span className="text-success"> Loading ... </span>
                </div>
              </LoadingComponent>
            </>
          ) : (
            <></>
          )}
          {children}
          <Toaster position="top-right" />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default HOC;
