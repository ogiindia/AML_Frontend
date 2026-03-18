/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { InlineSelect } from '@ais/components';
import { findfirstChildPath } from '@ais/utils';
import { useEffect, useState } from 'react';
import { Power, WindowDock } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { useNavigate } from 'react-router-dom';
import { CONTEXT_PATH } from '../config';
import { useGlobalContext } from '../utilites/Contexts/GlobalContext';
import { usePage } from '../utilites/Contexts/PageContext';
import './header.css';
import TopMenu from './TopMenu';

function Header({
  menudatas,
  headerMenu,
  saveSelect,
  setMenu,
  currentPage,
  valueSelect,
  minimizeMenu,
  isTopMenu,
}) {
  const { globalState, updateGlobalState } = useGlobalContext();
  const { updatePage, moduleList, setCurrentMenul2, setCurrentPage } =
    usePage();
  const [tmoduleList, setmoduleList] = useState([]);
  const [topLevelMenu, settopLevelMenu] = useState([]);

  const navigate = useNavigate();

  const logout = () => {
    //logout functionalities
    navigate('/login');
  };

  const TopMenuCallback = (data) => {
    if (menudatas.length > 0) {
      var filteredData = menudatas.filter((e, i) => e['tid'] === data['tid']);

      //set sub-menu for sidemenu
      if (Array.isArray(filteredData) && filteredData.length === 1)
        filteredData = filteredData[0];
      if ('children' in filteredData)
        setCurrentMenul2(filteredData['children']);

      //load default page for the selectedMenu i.e first page

      if ('children' in filteredData) {
        if (filteredData['children'].length > 0) {
          //load the first children

          const firstChildPath = findfirstChildPath(filteredData['children']);

          console.log(firstChildPath);

          navigate('/' + firstChildPath);
        } else {
          navigate('/' + filteredData['menu.path']);
        }
      }
    }
  };

  useEffect(() => {
    if (menudatas.length > 0) {
      const tempData = [];
      menudatas.map((m) => {
        var tempObj = {
          tid: m['tid'],
          label: m['menu.menuName'],
          //       children: m['submenu'] ? m['children'][0] : {}
        };
        tempData.push(tempObj);
        return null;
      });

      settopLevelMenu(tempData);
      setMenu(menudatas[0]);
      updatePage({
        menuLevels: menudatas,
      });
    }
  }, [menudatas]);

  useEffect(() => {
    var tempState = [];
    Object.keys(moduleList).map((e, i) => {
      var d = {
        name: e,
        value: e,
      };
      tempState.push(d);
      return null;
    });

    setmoduleList(tempState);
  }, [moduleList]);

  const updateModuleinContext = (e) => {
    updateGlobalState({
      module_name: globalState.moduleKeyList[e],
      module_key: e,
    });
  };

  return (
    <>
      <div className={`topbar-wrapper top-menu-layout`}>
        <div className="max-width-100">
          <div className="bb-10">
            <Row className="min-height-50">
              <Col lg="5">
                <img
                  src={globalState.logo || CONTEXT_PATH + './logo.png'}
                  className="header-logo"
                  alt="app logo"
                />
              </Col>
              <Col lg="7" className="justify-center flex-end">
                <div className="display-flex flex-column align-self-flex-bottom">
                  <div>
                    <div className="display-flex menu-location">
                      <span className="welcome justify-center capitalize">
                        {globalState.welcomeMsg}, {globalState.username}{' '}
                      </span>{' '}
                      &nbsp; <span className="justify-center">|</span> &nbsp;
                      <span className="welcome justify-center capitalize">
                        <span onClick={() => navigate('/manage')}>manage </span>
                      </span>{' '}
                      &nbsp; <span className="justify-center">|</span> &nbsp;
                      <span
                        onClick={() => navigate('/change-password')}
                        className="justify-center cursor-pointer capitalize"
                      >
                        Change Password
                      </span>{' '}
                      &nbsp; <span className="justify-center">|</span> &nbsp;
                      <span
                        onClick={() => logout()}
                        className="justify-center cursor-pointer capitalize"
                      >
                        logout &nbsp;{' '}
                        <Power
                          size={16}
                          className="justify-center align-self-center"
                        />{' '}
                      </span>{' '}
                      &nbsp;
                    </div>
                  </div>
                  <div className="flex-end">
                    <InlineSelect
                      labelComponent={<WindowDock size={15} />}
                      toolTiplocation="bottom"
                      toolTipMessage={
                        'List of applications allowed to the user'
                      }
                      selectedValue={globalState['module_key']}
                      callback={(e) => updateModuleinContext(e)}
                      data={tmoduleList}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <nav className="navbar navbar-expand-lg sticky-header navbar-light nav-bg">
            <div className="container-fluid">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className={`collapse navbar-collapse ${minimizeMenu ? 'pl-40' : ''}`}
                id="navbarNav"
              >
                <ul className="nav" id="fisCustomMenu">
                  {isTopMenu ? (
                    <TopMenu menus={topLevelMenu} callback={TopMenuCallback} />
                  ) : (
                    <>
                      {/* {Object.keys(headerMenu).map((key, i) => {
                        return (
                          <>
                            <Nav.Link
                              onClick={() => valueSelect(key)}
                              className={`header-menu-link ${globalState.module_key !== undefined && globalState.module_key === key
                                ? "activeTop"
                                : ""
                                }`}
                              href="#"
                            >
                              {headerMenu[key]}
                            </Nav.Link>
                          </>
                        )

                      })} */}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;
