import { List } from 'react-bootstrap-icons';
import '../static/css/sidebar-animation.scss';
import ModulesList from './ModulesList';
import SideMenu from './SideMenu';

function SideBar({
  minimizeMenu,
  globalState,
  setToggleStatus,
  currentMenu,
  headerMenu,
  valueSelect,
}) {
  return (
    <>
      {currentMenu !== undefined &&
        currentMenu !== null &&
        currentMenu.length > 0 &&
        globalState.sideMenu && (
          <div
            key={10}
            className={`sideMenu gradient-bg ${minimizeMenu ? 'minimized' : 'maximized'
              }`}
          >
            <div className={`simple-wrapper-overlay-y`}>
              <div className={`overlay`}>
                {/* <SideBar setMenu={setMenu} currentPage={currentPage} sidebarDatas={sidebarDatas} /> */}
                <div key={12} xs={12} md={12} sm={12}>
                  <div className="">
                    <div className="topIconLayout">
                      <img
                        src={globalState.logo}
                        className="header-logo"
                        alt="app logo"
                      />
                    </div>

                    <div className={`flex flex-1 modules-block`}>
                      <ModulesList
                        headerMenu={headerMenu}
                        selectedModule={globalState.module_key}
                        valueSelect={valueSelect}
                      />
                    </div>

                    {/* <Row>
                      <Col className="close-menu">
                        {!minimizeMenu ? (
                          <span onClick={() => setToggleStatus(!minimizeMenu)}>
                            <XLg key={20} size={20} className="color-white" />
                          </span>
                        ) : (
                          <> </>
                        )}
                      </Col>
                    </Row> */}
                    {!minimizeMenu ? (
                      <>
                        <SideMenu
                          key={currentMenu.length + 3}
                          menus={!minimizeMenu ? currentMenu : []}
                        />
                      </>
                    ) : (
                      <>
                        <span
                          className="justify-center cursor-pointer"
                          onClick={() => setToggleStatus(!minimizeMenu)}
                        >
                          <List size={20} />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p></p>
            </div>
          </div>
        )}
    </>
  );
}

export default SideBar;
