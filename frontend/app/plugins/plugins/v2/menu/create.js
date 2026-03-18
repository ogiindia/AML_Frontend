/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { jsonToGraphQLQuery, VariableType } from "@ais/graphql";
import { flattenArray, sortArray } from "@ais/utils";
import RenderForm from "RenderForm";
import api from "api";
import generateQueryFromFormJson from "generateQueryFromFormJson";
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import HierarchicalView from "../../../components/HierarchicalView";
import MenuList from "../../../components/MenuList";
import MenuJson from "../../../json/menuConfiguration.json";
import { convertMenuToMultiLevelJSON } from "../../../utils";

function createMenu() {
    const [data, setdata] = useState(null);
    const [formData, setformData] = useState({});


    const rawgql = {
        query: {
            listEntityMaster: {
                module: true,
                isMenu: true,
                tid: true,
                id: true,
                entityName: true,
                menu: {
                    menuName: true,
                    path: true,
                    page: true,
                    subMenu: true,
                    parentMenuID: true,
                    module: true,
                    showInMenu: true,
                    icons: true,
                    MenuOrder: true
                }
            }
        }
    };




    const loadData = () => {
        const gql = jsonToGraphQLQuery(rawgql);

        api.graphql(gql, {}).then(res => {
            const { data } = res;
            if (data) {
                const dd = convertMenuToMultiLevelJSON(sortArray(flattenArray(data.listEntityMaster), "menu.MenuOrder"));
                console.log(dd);
                setdata(dd);
            }

        });
    }


    useEffect(() => {

        loadData();

    }, []);


    const callbackId = (id) => {
        if (id) {
            const fetchQuery = {
                query: {
                    __variables: {
                        id: "UUID!"
                    },
                    findEntityMasterbyId: {
                        __args: {
                            id: new VariableType('id')
                        },
                        module: true,
                        isMenu: true,
                        tid: true,
                        id: true,
                        entityName: true,
                        menu: {
                            menuName: true,
                            path: true,
                            page: true,
                            subMenu: true,
                            parentMenuID: true,
                            module: true,
                            showInMenu: true,
                            icons: true,
                            MenuOrder: true
                        }
                    }
                }
            };


            console.log(fetchQuery);
            const gql = jsonToGraphQLQuery(fetchQuery);

            api.graphql(gql, { id: id }).then(res => {
                const { data } = res;
                if (data && data.findEntityMasterbyId) {
                    const flateredArray = flattenArray(data.findEntityMasterbyId, "");
                    console.log(flateredArray);
                    setformData(flateredArray);
                }

            });

        }
    }

    const callback = (values, actions) => {


        const data = {
            entity: {
                id: values.id === "" ? null : values.id,
                entityName: values.entityName,
                module: values.module,
                isMenu: values.isMenu,
                tid: values.tid,
                menuName: values.menumenuName,
                path: values.menupath,
                page: values.menupage,
                subMenu: values.menuparentMenuID ? true : false,
                parentMenuID: values.menuparentMenuID,
                showInMenu: values.menushowInMenu,
                icons: values.menuicons,
                MenuOrder: values.menuMenuOrder
            }
        }

        const args = {
            entity: {
                id: true,
                entityName: true,
                module: true,
                isMenu: true,
                tid: true,
                menu: {
                    menuName: true,
                    path: true,
                    page: true,
                    subMenu: true,
                    parentMenuID: true,
                    module: true,
                    showInMenu: true,
                    icons: true,
                    MenuOrder: true
                }
            }
        }


        console.log(data);
        const gqlQuery = generateQueryFromFormJson(MenuJson, args, true);

        api.graphql(gqlQuery, data.entity).then(res => {
            if (res && res.data) {
                setformData({});
                loadData();

            }
        }
        );
    }


    const triggerClearData = () => {
        setformData({});
    }
    return (<>
        <Row>
            <Col sm={6} md={6} lg={6}>
                <RenderForm
                    formFormat={MenuJson}
                    callback={callback}
                    formData={formData}
                >
                    {(props) => {
                        return <button type="button" onClick={() => triggerClearData()} className={`btn btn-primary align-right`}> clear data </button>
                    }}


                </RenderForm>
            </Col>
            <Col sm={6} md={6} lg={6}>
                <HierarchicalView data={data}>
                    {(value) => (

                        <>
                            <MenuList callback={callbackId} {...value} />
                        </>
                    )}
                </HierarchicalView>
            </Col>
        </Row>
    </>);
}

export default createMenu;