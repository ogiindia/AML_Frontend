import { filterJson, sortArray } from '@ais/utils';
import React, { createContext, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPage } from '../../redux/PageHistorySlice';


const PageContext = createContext();

export const usePage = () => {
  return useContext(PageContext);
};

export const PageProvider = ({ children }) => {
  const initalState = {
    currentPage: 'login',
    rawMenu: [],
    convertedMenu: [],
    modulesList: [],
    menuLevels: [],
    breadcrumbsData: [],
    activeMenus: ['a'],
    currentMenu: [],
  };

  //always maintain intial state in this file
  const [page, setPageState] = useState(initalState);
  const [currentPage, setcurrentPage] = useState('');
  const [currentMenu, setcurrentMenu] = useState([]);
  const [currentMenul2, setcurrentMenul2] = useState([]);
  const [pageData, setPData] = useState({});
  const [moduleList, setmoduleList] = useState({});
  // const pageHistory = useSelector((state) => state.pageHistory);
  const dispatch = useDispatch();

  const updatePage = (data) => {
    setPageState((prevState) => {
      const newState = { ...prevState };

      Object.keys(data).forEach((key, i) => {
        newState[key] = data[key];
      });
      return newState;
    });
  };

  const updateModuleList = (data) => {
    setmoduleList((prevState) => {
      const newState = { ...prevState };
      Object.keys(data).forEach((key, i) => {
        newState[key] = data[key];
      });
      return newState;
    });
  };

  const resetPage = () => {
    setPageState(initalState);
  };

  const setCurrentPage = (pg) => {
    dispatch(addPage(pg));
    setcurrentPage(pg);
    setPageState({
      ...page,
      currentPage: pg,
    });
  };

  const setCurrentMenu = (menu) => {
    setPageState({
      ...page,
      menuLevels: menu,
    });
    setcurrentMenu(menu);
  };

  const setCurrentMenul2 = (menu) => {
    setcurrentMenul2(menu);
  };

  const findMatchingObject = (tid) => {
    var jsonData = page.rawMenu;
    var resultData = [];
    jsonData.filter((obj, arr) => {
      if (typeof obj === 'object') {
        if (obj['tid'] === tid) {
          return pushDataToArray(arr, obj, resultData);
          //   return result;
        }
      }
      return null;
    });
    return resultData;
  };

  const pushDataToArray = (arr, obj, resultData) => {
    if (Array.isArray(obj) && obj.length === 1) obj = obj[0];
    if (Array.isArray(arr)) {
      resultData.push(obj);
      console.log(arr);
      if (obj['menu.parentMenuID'] !== undefined && obj['menu.parentMenuID'] !== null) {
        pushDataToArray(
          arr,
          filterJson([...arr], 'tid', obj['menu.parentMenuID']),
          resultData,
        );
      }
    }
    return resultData;
  };

  const setActiveMenu = (menu, tid) => {
    const currentPage = menu['path'];
    setCurrentPage(currentPage);
    setPageState({
      ...page,
      breadcrumbsData: sortArray(findMatchingObject(tid), 'tid'),
      currentPage: currentPage,
    });
  };

  const setPageData = (data) => {
    setPData({ ...data });
  };

  return (
    <PageContext.Provider
      value={{
        currentPage,
        page,
        currentMenu,
        currentMenul2,
        pageData,
        moduleList,
        setCurrentMenu,
        updatePage,
        updateModuleList,
        resetPage,
        setCurrentPage,
        setActiveMenu,
        setPageData,
        setCurrentMenul2,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
