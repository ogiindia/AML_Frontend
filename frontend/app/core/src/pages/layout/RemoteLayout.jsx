import { SideBarLayout } from '@ais/components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import DynamicComponent from '../../components/DynamicComponent';
import { useGlobalContext } from '../../utilites/Contexts/GlobalContext';
import { usePage } from '../../utilites/Contexts/PageContext';
import { CONTEXT_PATH } from '../../config';
// a layout to render only the remote components wrapped with public layout
function RemoteLayout({ page }) {
  const { pageData } = usePage();

  const navigate = useNavigate();
  const { currentMenu } = usePage();
  const { apps, globalState } = useGlobalContext();

  const [username, setusername] = useState("");
  const [groupname, setgroupname] = useState("");

  const menuCallback = (route) => {
    if (route) {
      console.log('route to execute : ' + route);
      if (route === '/logout') {
        location.reload();
      } else {
        navigate(route);
      }
    }
  };

  useEffect(() => {
    setgroupname(globalState.groupName);
    setusername(globalState.username);
  }, [globalState]);

  return (
    <>
      <SideBarLayout
        modules={apps}
        menuData={currentMenu}
        username={username}
        groupName={groupname}
        callback={menuCallback}
      >
        <div className="dynamic-renderer" style={{
          backgroundImage: `url(${CONTEXT_PATH}/bg-center.png)`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}>
          <DynamicComponent data={pageData} key={page} __id={page} />
        </div>
      </SideBarLayout>
    </>
  );
}

export default RemoteLayout;
