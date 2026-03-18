/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Icons } from '@ais/components';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { ChevronDown, ChevronRight, CircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import { usePage } from '../utilites/Contexts/PageContext';

const SideMenu = ({ menus, isMenuMiniized }) => {
  const { page, updatePage, setActiveMenu } = usePage();
  const [activeMenus, setActiveMenus] = useState([]);
  const navigate = useNavigate();

  const handleMenuClick = (data, dept) => {
    data['dept'] = dept;

    var actMenus = [];
    actMenus.push(data);

    if (dept < 2) {
      if ('children' in data && data['children'].length === 0)
        navigate('/' + data['menu.path']);
    } else {
      // find parent
      if ('menu.path' in data && data['menu.path'] !== '')
        navigate('/' + data['menu.path']);
    }
    setActiveMenus(actMenus);

    updatePage({
      activeMenus: activeMenus,
    });

    if (data['children'].length === 0) {
      setActiveMenu(data, data['tid']);
    }
  };

  const ListMenu = ({ dept, data, hasSubMenu, menuName, menuIndex }) => {
    switch (dept) {
      case 1:
      case 2:
        return (
          <li
            className={`menu-level-${dept}`}
            key={'list-menu-' + menuIndex + dept}
          >
            <Row className={``}>
              <div
                className={`menu-border-class ${
                  activeMenus.includes(data) ? 'active' : 'activeElement'
                }`}
                dept={dept}
                key={dept}
                onClick={() => handleMenuClick(data, dept)}
              >
                <div
                  className={`display-flex flex-1  menu-level sidemenu-level-${dept}`}
                >
                  <div
                    className={`display-flex align-center align-self-center`}
                  >
                    <Icons
                      className={`flex me-2`}
                      iconName={
                        data['menu.icons'] != null && data['menu.icons']
                      }
                    />

                    <a className={`capitalize display-flex flex`}>
                      {data['menu.menuName']}
                    </a>
                  </div>
                  {hasSubMenu && (
                    <>
                      <div className={`flex-1 flex-end align-self-center`}>
                        {activeMenus.includes(data) ? (
                          <ChevronDown
                            key={menuIndex}
                            onClick={() => handleMenuClick(data, dept)}
                          />
                        ) : (
                          <ChevronRight
                            key={menuIndex}
                            onClick={() => handleMenuClick(data, dept)}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Row>
            {hasSubMenu && activeMenus.includes(data) && (
              <>
                <SubMenu
                  dept={dept}
                  key={menuIndex}
                  data={data.children}
                  menuIndex={menuIndex}
                />
              </>
            )}
          </li>
        );
      default:
        return (
          <li className="" key={'list-menu-default' + menuIndex + dept}>
            <Row
              className={``}
              key={menuIndex}
              // style={{
              //   paddingLeft: "5" * dept,
              // }}
            >
              <div
                className={`menu-border-class ${
                  activeMenus.includes(data) ? 'active' : 'activeElement'
                }`}
                dept={dept}
                key={dept}
                onClick={() => handleMenuClick(data, dept)}
              >
                <Col
                  lg={8}
                  md={8}
                  sm={10}
                  key={menuIndex}
                  className={`sub-menu-parent`}
                >
                  <Row className={`sub-menu`}>
                    <Col className={`align-center`} key={2} sm={2}>
                      <CircleFill className={`sub-menu-icon`} size={3} />
                    </Col>
                    <Col sm={10}>
                      <a className="capitalize">{data['menu.menuName']}</a>
                    </Col>
                  </Row>
                </Col>
                <Col className={'flex-end'} key={menuIndex + menuName}>
                  {hasSubMenu && (
                    <>
                      {activeMenus.includes(data) ? (
                        <ChevronDown
                          key={menuIndex}
                          onClick={() => handleMenuClick(data, dept)}
                        />
                      ) : (
                        <ChevronRight
                          key={menuIndex}
                          onClick={() => handleMenuClick(data, dept)}
                        />
                      )}
                    </>
                  )}
                </Col>
              </div>
            </Row>
            {hasSubMenu && activeMenus.includes(data) && (
              <SubMenu
                dept={dept}
                key={menuIndex}
                data={data.children}
                menuIndex={menuIndex}
              />
            )}
          </li>
        );
    }
  };
  const SubMenu = ({ dept, data, menuIndex }) => {
    dept = dept + 1;
    data['dept'] = dept;
    return (
      <ul
        className={`${
          activeMenus.includes(data) ? 'display-block' : 'display-none'
        } timeline`}
      >
        {data.map((menu, index) => {
          const menuName = `sub-menu sidebar-submenu-${dept}-${menuIndex}-${index}`;
          return (
            <div key={menuName}>
              <ListMenu
                dept={dept}
                data={menu}
                hasSubMenu={menu.children.length > 0}
                menuName={menuName}
                key={menuName}
                menuIndex={index}
              ></ListMenu>
            </div>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <>
        <ul key={`sidemenu-${menus.length}`} className={`sidemenu-parent`}>
          {menus.map((menu, index) => {
            const dept = 1;
            const menuName = 'Menu-parent' + dept + index;
            menu['dept'] = dept;

            // eslint-disable-next-line array-callback-return
            if (!menu['menu.showInMenu']) return;
            else
              return (
                <div key={menuName}>
                  <ListMenu
                    dept={dept}
                    data={menu}
                    hasSubMenu={menu.children.length > 0}
                    menuName={menuName}
                    key={menuName}
                    menuIndex={index}
                  />
                </div>
              );
          })}
        </ul>
      </>
    </>
  );
};

export default SideMenu;
