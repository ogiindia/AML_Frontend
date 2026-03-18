/* eslint-disable no-unused-vars */
import api from '@ais/api';
import { Col, Row, TableLayout } from '@ais/components';
import { jsonToGraphQLQuery } from '@ais/graphql';
import { sortArray } from '@ais/utils';
import Card from 'Card';
import Loading from 'Loading';
import React, { useEffect, useState } from 'react';
import ConfigurationSubComponent from '../../../components/ConfigurationSubComponent';
import { convertToMultiLevelJson } from '../../../utils';

function LoadConfigurations() {
  // query ListConfiguration {
  //     listConfiguration {
  //         defaultValue
  //         fieldType
  //         optionData
  //         createdBy
  //         id
  //         updatedAt
  //         grp
  //         createdAt
  //         description
  //         name
  //         module
  //         scope
  //         configKey
  //         ord
  //     }
  // }

  const [rawData, setrawData] = React.useState([]);
  const [menus, setmenus] = useState([]);
  const [convertedMenu, setconvertedMenu] = useState({});
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [activeModule, setactiveModule] = useState(null);
  const [childData, setchildData] = useState({});

  const loadinitalData = () => {
    setloading(true);
    const rawQuery = {
      query: {
        listConfiguration: {
          defaultValue: true,
          fieldType: true,
          optionData: true,
          createdBy: true,
          id: true,
          updatedAt: true,
          grp: true,
          createdAt: true,
          description: true,
          name: true,
          module: true,
          scope: true,
          configKey: true,
          ord: true,
        },
      },
    };

    const gqlQuery = jsonToGraphQLQuery(rawQuery);
    console.log(gqlQuery);

    api.graphql(gqlQuery, {}).then((res) => {
      console.log(res);

      if (res && res.error) seterror(res.error);
      if (res && res.loading) setloading(res.loading);
      if (res && res.data) {
        setrawData(sortArray(res.data.listConfiguration, 'ord'));
      }
    });
  };

  useEffect(() => {
    loadinitalData();
  }, []);

  useEffect(() => {
    if (rawData) {
      const convertedData = convertToMultiLevelJson(rawData);
      setconvertedMenu(convertedData);
      setmenus(Object.keys(convertedData));
      setloading(false);
    }
  }, [rawData]);

  useEffect(() => {
    if (activeModule) setchildData(convertedMenu[activeModule]);
  }, [activeModule, convertedMenu]);

  const loadConfigForModule = (item) => {
    if (item) {
      setactiveModule(item);
    }
  };

  if (loading) return <Loading />;
  else
    return (
      <TableLayout padding={false}>
        <Row>
          <Col span={'3'} sm={'3'} md={'3'} lg={'3'}>
            <div class="py-2"></div>
            <Card>
              <ul className={`sidemenu-parent`}>
                {menus &&
                  menus.map((item, index) => (
                    <li
                      className={`menu-level-1 cursor-pointer pt-4`}
                      key={index}
                    >
                      <Row>
                        <Col
                          className={`menu-border-class ${item === activeModule && 'active'}`}
                        >
                          <div
                            className={`display-flex flex-1  menu-level sidemenu-level-1 underline`}
                            onClick={(e) => loadConfigForModule(item)}
                          >
                            {item}
                          </div>
                        </Col>
                      </Row>
                    </li>
                  ))}
              </ul>
            </Card>
          </Col>
          <Col span={'8'} padding={false}>
            {childData && <ConfigurationSubComponent data={childData} />}
          </Col>
        </Row>
      </TableLayout>
    );
}

export default LoadConfigurations;
