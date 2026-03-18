import { Row, SimpleSideBarLayout } from '@ais/components';
import React from 'react';
import RemoteComponent from 'RemoteComponent';

function ManageApp() {
  const [RemoteName, setRemoteName] = React.useState(
    'v2-configurations-create',
  );
  const loadComponent = (page) => {
    console.log(page);
    setRemoteName(page);
  };

  return (
    // <>
    //   <Row>
    //     <button className="btn btn-success" onClick={() => navigate(-1)}>
    //       back
    //     </button>
    //     <Col sm={3} md={3} lg={3}>
    //       <ul>
    //         <li>
    //           <a onClick={() => loadComponent('v2-configurations-create')}>
    //             configurations
    //           </a>
    //         </li>

    //         <li>
    //           <a onClick={() => loadComponent('v2-menu-create')}>Menus</a>
    //         </li>
    //       </ul>
    //     </Col>
    //
    //   </Row>
    // </>

    <SimpleSideBarLayout
      menuCallBack={(p) => loadComponent(p)}
      menuData={[
        {
          title: 'Manage your application',
          url: '#',
          items: [
            {
              title: 'Modules',
              url: 'v2-modules-create',
            },
            {
              title: 'Entity Master',
              url: 'v2-entity-create',
            },
            {
              title: 'Menu Master',
              url: 'v2-menu-create',
            },
            {
              title: 'Configuration',
              url: 'v2-configurations-create',
            },
          ],
        },
      ]}
    >
      {RemoteName && (
        <Row justify="center" align="center">
          <RemoteComponent key={RemoteName} __id={RemoteName} />
        </Row>
      )}
    </SimpleSideBarLayout>
  );
}

export default ManageApp;
