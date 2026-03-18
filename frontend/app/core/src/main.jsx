/* eslint-disable no-unused-vars */
import { convertToMultiLevel, filterJson } from '@ais/utils';
import { useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { useSelector } from 'react-redux';
import DynamicComponent from './components/DynamicComponent';
import Header from './header/Header';
import SideBar from './header/SideBar';
import { useGlobalContext } from './utilites/Contexts/GlobalContext';
import { usePage } from './utilites/Contexts/PageContext';

function Layout({ children }) {
  const { globalState, updateGlobalState } = useGlobalContext();

  const [headerMenu, setHeaderMenu] = useState({});
  const [menudatas, SetMenuDatas] = useState([]);
  const [sidebarDatas, setSiderBarDatas] = useState([]);
  const {
    currentPage,
    pageData,
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
        {!globalState.sideMenu && (
          <Header
            headerMenu={headerMenu}
            menudatas={currentMenu}
            saveSelect={saveSelect}
            valueSelect={valueSelect}
            setMenu={setMenu}
            key={currentMenu.length + 1}
            currentPage={currentPage}
            minimizeMenu={minimizeMenu}
          />
        )}
        <Row>
          <SideBar
            valueSelect={valueSelect}
            headerMenu={headerMenu}
            minimizeMenu={minimizeMenu}
            globalState={globalState}
            setToggleStatus={setToggleStatus}
            currentMenu={currentMenu}
          />

          <Col
            key={1}
            className={`custom-content-block ${minimizeMenu ? 'pl-60' : 'pl-0'}`}
          >
            {globalState.sideMenu && (
              <Header
                headerMenu={headerMenu}
                menudatas={currentMenu}
                saveSelect={saveSelect}
                valueSelect={valueSelect}
                setMenu={setMenu}
                key={currentMenu.length + 2}
                currentPage={currentPage}
                minimizeMenu={minimizeMenu}
              />
            )}

            <div className="">
              {currentPage !== undefined && currentPage !== '' && (
                <>
                  {console.warn('loading dynamic components')}

                  <div className="row">
                    <DynamicComponent
                      data={pageData}
                      key={currentPage}
                      __id={currentPage}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="pd-30">{children}</div>
          </Col>
        </Row>

        {/* <div className="footer ">
          <footer className="fis-primary-bg text-white text-center text-lg-start">
            <div className="text-center p-2">©2024 FIS</div>
          </footer>
        </div> */}
      </>
    </>
  );
}

export default Layout;
