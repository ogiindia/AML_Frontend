import { Route, Routes } from 'react-router-dom';

import { useEffect, useState } from 'react';
import RemoteLayout from '../pages/layout/RemoteLayout';
import { usePage } from '../utilites/Contexts/PageContext';

function DynamicNavigations() {
  const { page } = usePage();

  const [uniqueRoutes, setuniqueRoutes] = useState([]);

  useEffect(() => {
    const menuData = page.rawMenu || [];
    const tempMappedRoute = [];
    menuData.forEach((menu, index) => {
      if (menu['page'] && menu['path']) {
        var routeData = {
          page: menu['page'],
          path: menu['path'],
        };
        tempMappedRoute.push(routeData);
      }
    });

    console.log(tempMappedRoute);
    setuniqueRoutes(tempMappedRoute);
  }, [page.rawMenu]);

  return (
    <>
      <Routes>
        {uniqueRoutes.map(({ path, page }, index) => (
          <Route
            key={index}
            path={path}
            element={<RemoteLayout page={page} />}
          />
        ))}
        {/* <Route path="*" element={<div>Route not found</div>} /> */}
      </Routes>
    </>
  );
}

export default DynamicNavigations;
