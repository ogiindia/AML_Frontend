/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { findfirstChildPath } from '@ais/utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useGlobalContext } from '../utilites/Contexts/GlobalContext';
import { usePage } from '../utilites/Contexts/PageContext';

function Home() {
  const [graphData, setgraphData] = useState();
  const { currentMenu, page } = usePage();
  const { globalState } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('into hoc');
    console.log(currentMenu);

    // Check if filtered menu list is empty when module is selected
    if (globalState.module_key) {
      const filteredMenus = page.convertedMenu?.[globalState.module_key] || [];

      if (!filteredMenus || filteredMenus.length === 0) {
        navigate('/no-permission');
        return;
      }
    }

    if (currentMenu && currentMenu.length) {
      const firstChild = findfirstChildPath(currentMenu);
      console.log(firstChild);
      if (firstChild) navigate(firstChild);
    }
  }, [currentMenu]);

  // const query = {
  //   query: {
  //     Posts: {
  //       __args: {
  //         arg1: 20,
  //       },
  //       __fields: ["field1", "field2"],
  //       id: true,
  //       name: true
  //     }

  //   }
  // };

  // const dt = {
  //   "queryType": "getUsers",
  //   "columns": [{ "key": "id", "type": "string", show: false, "label": "userId" },
  //   { "key": "name", "type": "string", show: true, "label": "name" }
  //   ],
  //   "paging": { "pageNo": 1, size: 10 },
  //   "sorting": { key: "id", direction: "DESC" },
  //   "filters": [{ "key": "id", value: "0" }]
  // }

  return <>{/* have to implement loading and post login HOC */}</>;
}

export default Home;
