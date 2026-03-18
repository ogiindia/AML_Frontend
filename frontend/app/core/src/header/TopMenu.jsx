/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { ChevronDown } from 'react-bootstrap-icons';
import { useGlobalContext } from '../utilites/Contexts/GlobalContext';
import { usePage } from '../utilites/Contexts/PageContext';

const TopMenu = ({ menus, callback }) => {
  const { page, updatePage, setActiveMenu, setCurrentMenu } = usePage();
  const { globalState, updateGlobalState } = useGlobalContext();
  const [menu, setMenus] = useState([]);
  const [activeMenu, storeActiveMenu] = useState(0);

  // useEffect(() => {
  //   storeActiveMenu(page.breadcrumbsData);
  // }, [page.breadcrumbsData]);

  // const handleMenuClick = (data, dept) => {
  //   if (data["children"].length === 0) {
  //     setActiveMenu(data, data["tid"]);
  //   }
  // };

  const handleMenuClick = (data, dept) => {
    if (data['tid']) {
      storeActiveMenu(data['tid']);
      if (callback) callback(data);
    }
  };

  useEffect(() => {
    console.log(menus);
  }, [menus]);

  const backgroundImage = `URL(${ChevronDown}) no-repeat right 50%`;

  // const DropdownListItem = ({
  //   dept,
  //   data,
  //   hasSubMenu,
  //   menuName,
  //   menuIndex,
  // }) => {
  //   return data.map((menu, index) => {
  //     return (
  //       <>
  //         <div
  //           //        className={`menu-border-class ${activeMenus.includes(data) ? "active" : "activeElement"}`}
  //           dept={dept}
  //           key={index}
  //           onClick={() => handleMenuClick(menu, dept)}
  //         >
  //           <Dropdown.Item
  //             key={index}
  //             className={`dropdown-item-class

  //             ${activeMenu !== undefined && activeMenu.includes(menu)
  //                 ? "active"
  //                 : ""
  //               }`}
  //           >
  //             <Row className={``}>
  //               <Col lg={8} md={8} sm={10}>
  //                 <span>{menu.label}</span>
  //               </Col>
  //               <Col className={"justify-center align-self-center"}>
  //                 {menu.children.length > 0 && <ChevronRight />}
  //               </Col>
  //             </Row>

  //             {menu.children.length > 0 && (
  //               <>
  //                 <SubMenu
  //                   dept={dept}
  //                   data={menu.children}
  //                   menuIndex={menuIndex}
  //                 />
  //               </>
  //             )}
  //           </Dropdown.Item>
  //         </div>
  //       </>
  //     );
  //   });
  // };

  // const ListMenu = ({ dept, data, hasSubMenu, menuName, menuIndex }) => {
  //   dept = dept + 1;
  //   data["dept"] = dept;
  //   console.warn(activeMenu);
  //   console.warn(data);
  //   console.warn(activeMenu.includes(data));
  //   return (
  //     <div
  //       //        className={`menu-border-class ${activeMenus.includes(data) ? "active" : "activeElement"}`}
  //       dept={dept}
  //       key={menuIndex}
  //       onClick={() => handleMenuClick(data, dept)}
  //     >
  //       <Dropdown.Item
  //         className={`dropdown-item-class ${activeMenu !== undefined && activeMenu.includes(data)
  //           ? "active"
  //           : ""
  //           }`}
  //       >
  //         <Row className={``}>
  //           <Col lg={8} md={8} sm={10}>
  //             <span>{data.label}</span>
  //           </Col>
  //           <Col className={"justify-center align-self-center"}>
  //             {hasSubMenu && <ChevronRight />}
  //           </Col>
  //         </Row>

  //         {hasSubMenu && (
  //           <>
  //             <SubMenu dept={dept} data={data.children} menuIndex={menuIndex} />
  //           </>
  //         )}
  //       </Dropdown.Item>
  //     </div>
  //   );
  // };

  // const SubMenu = ({ dept, data, menuIndex }) => {
  //   return (
  //     <Dropdown.Submenu position="right">
  //       {data.map((menu, index) => {
  //         const menuName = `sidebar-submenu-${dept}-${menuIndex}-${index}`;
  //         dept = dept + 1;
  //         menu["dept"] = dept;

  //         return (
  //           <ListMenu
  //             dept={dept}
  //             data={menu}
  //             hasSubMenu={menu.children.length > 0}
  //             menuName={menuName}
  //             key={menuName}
  //             menuIndex={index}
  //           ></ListMenu>
  //         );
  //       })}
  //     </Dropdown.Submenu>
  //   );
  // };

  return (
    <>
      {menus !== undefined &&
        menus !== null &&
        menus.map((menu, index) => {
          const dept = 1;
          const menuName = `sidebar-menu-${dept}-${index}`;
          menu['dept'] = dept;

          return (
            <div
              key={menuName}
              className={`menu-click ${activeMenu === menu['tid'] && 'active'}`}
            >
              <div
                onClick={() => handleMenuClick(menu, dept)}
                className={`header-menu-link`}
                href="#"
              >
                <div className={`menu-item px-2`}>{menu.label}</div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default TopMenu;
