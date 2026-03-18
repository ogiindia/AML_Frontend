/* eslint-disable no-unused-vars */
import { convertToMultiLevel, filterJson } from '@ais/utils';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../header/Header';
import { useGlobalContext } from '../../utilites/Contexts/GlobalContext';
import { usePage } from '../../utilites/Contexts/PageContext';

function TopBarLayout({ children }) {
  const { globalState, updateGlobalState } = useGlobalContext();
  const [headerMenu, setHeaderMenu] = useState({});
  const [menudatas, SetMenuDatas] = useState([]);
  const [sidebarDatas, setSiderBarDatas] = useState([]);
  const {
    currentPage,
    setCurrentPage,
    page,
    currentMenu,
    setCurrentMenu,
  } = usePage();
  const [minimizeMenu, setToggleStatus] = useState(false);

  const notify = useSelector((state) => state.notify);

  const saveSelect = (event) => {
    updateGlobalState({
      module_name: globalState.moduleKeyList[event.target.value],
      module_key: event.target.value,
    });
    setCurrentMenu(
      convertToMultiLevel(
        page.convertedMenu[event.target.value],
        'tid',
        'menuparentMenuID',
      ),
    );
  };

  const valueSelect = (e) => {
    updateGlobalState({
      module_name: globalState.moduleKeyList[e],
      module_key: e,
    });
    setCurrentMenu(
      convertToMultiLevel(page.convertedMenu[e], 'tid', 'menuparentMenuID'),
    );
  };

  //yet to work.
  const setMenu = (ele) => {
    var parentId = ele.menuparentMenuID;
    if (parentId === undefined) parentId = ele.tid;
    updateGlobalState({
      aMenu: ele.path,
      aMenuParentId: ele.menuparentMenuID,
    });

    if (!ele.subMenu) {
      //when the menu is clicked update the sidebar
      setSiderBarDatas((ps) => {
        var existingState = ele;
        var newState = filterJson(menudatas, 'menuparentMenuID', parentId);
        if (newState.length > 0) {
          var updatedState = [existingState, ...newState];
          return updatedState;
        } else {
          return newState;
        }
      });
    }

    setCurrentPage(ele.path);
  };

  return (
    <>
      <>
        <>
          <Header
            headerMenu={headerMenu}
            menudatas={currentMenu}
            saveSelect={saveSelect}
            valueSelect={valueSelect}
            setMenu={setMenu}
            key={currentMenu.length + 1}
            currentPage={currentPage}
            minimizeMenu={minimizeMenu}
            isTopMenu
          />

          {children}
        </>
      </>
    </>
  );
}

export default TopBarLayout;
