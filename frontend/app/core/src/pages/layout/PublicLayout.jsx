import api from '@ais/api';
import { InlineSelect, StatusBlock } from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Breadcrumb, Card, Col, Container, Row } from 'react-bootstrap';
import {
  Bank2,
  BookmarkDashFill,
  CaretRightFill
} from 'react-bootstrap-icons';
import { useLocation } from 'react-router';
import SideMenu from '../../header/SideMenu';
import { usePage } from '../../utilites/Contexts/PageContext';
import TopBarLayout from './TopBarLayout';

function PublicLayout({ children }) {
  const [floatingSideBar, setfloatingSideBar] = useState(true);
  const [showMarker, setshowMarker] = useState(true);
  const [activeInstitution, setactiveInstitution] = useState("");

  const [institutionlist, setinstitutionlist] = useState([]);


  const [divisionList, setdivisionList] = useState([]);

  const { currentMenul2 } = usePage();

  const { state } = useLocation();

  useEffect(() => {
    if (Array.isArray(currentMenul2) && currentMenul2.length === 0) {
      setfloatingSideBar(false);
      setshowMarker(false);
    } else {
      setfloatingSideBar(true);
      setshowMarker(true);
    }
  }, [currentMenul2]);

  // eslint-disable-next-line no-unused-vars
  const notificationDisplayBlock = () => {
    console.log(state);
    if (state && state.status)
      return (
        <>
          <StatusBlock type={state.status} message={state.message} />
        </>
      );
    return <></>;
  };



  const updateactiveInstitution = (id) => {
    setactiveInstitution(id);
  }


  useEffect(() => {


    if (activeInstitution) {
      var divisions = {
        query: {
          __variables: {
            "id": "UUID!"
          },
          findDivisionByInstituionId: {
            __args: {
              id: new VariableType('id')
            },
            id: true,
            divisionName: true
          }
        }
      };

      var gql = jsonToGraphQLQuery(divisions);

      api.graphql(gql, { id: activeInstitution }).then(res => {
        if (res.data) {
          const institutions = res.data['findDivisionByInstituionId'];

          if (institutions && institutions.length > 0) {
            const options = institutions.map((institution, i) => {
              let jsonObj = {
                name: institution['id'],
                value: institution['divisionName']
              }

              return jsonObj;

            });

            if (options.length > 1) {
              setdivisionList([{
                name: "",
                value: "All Divisions"
              }, ...options]);
            } else {
              setdivisionList(options);
            }
            console.log(options);
          }

        }
      });
    }
  }, [activeInstitution]);

  useEffect(() => {
    //load institutions 

    var institution = {
      query: {
        listInstitutionEntity: {
          id: true,
          institutionName: true
        }
      }
    };

    var gql = jsonToGraphQLQuery(institution);

    api.graphql(gql, {}).then(res => {
      if (res.data) {
        const institutions = res.data['listInstitutionEntity'];

        if (institutions && institutions.length > 0) {
          const options = institutions.map((institution, i) => {
            let jsonObj = {
              name: institution['id'],
              value: institution['institutionName']
            }

            return jsonObj;

          });

          if (options.length > 1) {
            setinstitutionlist([{
              name: "",
              value: "All Institutions"
            }, ...options]);
          } else {
            setinstitutionlist(options);
          }
          console.log(options);
        }

      }
    });








  }, []);




  // have to handle the top menu layout and side menu layout
  return (
    <>
      <TopBarLayout>
        <div className="content-block position-relative public-layout">
          <Container fluid>
            {/* Content and sub- menu block */}
            <div className="p-3">
              <div
                style={{
                  display: 'flex',
                }}
              >
                <motion.div
                  inital={{ width: floatingSideBar ? '16.666%' : '0%' }}
                  animate={{ width: floatingSideBar ? '16.666%' : '0%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {floatingSideBar && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: floatingSideBar ? 1 : 0 }}
                        transition={{
                          duration: 0.3,
                          delay: floatingSideBar ? 0.3 : 0,
                        }}
                        style={{
                          pointerEvents: floatingSideBar ? 'block' : 'none',
                          flex: 1,
                        }}
                      >
                        {/* //side menu block */}
                        <Col className="pe-3">
                          <Card>
                            <SideMenu
                              menus={currentMenul2}
                              isMenuMiniized={floatingSideBar}
                            />
                          </Card>
                        </Col>
                      </motion.div>
                    </>
                  )}
                </motion.div>

                <motion.div
                  inital={{ width: floatingSideBar ? '83.334%' : '100%' }}
                  animate={{ width: floatingSideBar ? '83.334%' : '100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Col>
                    {/* Heading block and breadcrumbs */}

                    <Row>
                      <Col>
                        <div className="p-1">
                          {/* Breadcrumb sections  yet to work on it */}

                          <Row>
                            <Col>
                              <Breadcrumb
                                style={{
                                  marginBottom: 'unset',
                                }}
                              >
                                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                                <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
                                  Library
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>Data</Breadcrumb.Item>
                              </Breadcrumb>
                            </Col>
                            <Col>
                              <div className="flex-end">
                                <div className="display-flex flex-row">
                                  <div className="display-flex">
                                    <InlineSelect
                                      callback={updateactiveInstitution}
                                      data={institutionlist}
                                      labelComponent={<Bank2 size={15} />}
                                      toolTiplocation="top"
                                      toolTipMessage={
                                        'Institution mapped to the user select to switch the institution'
                                      }
                                    />
                                  </div>

                                  <div className="display-flex">
                                    <InlineSelect
                                      data={divisionList}
                                      labelComponent={
                                        <BookmarkDashFill size={15} />
                                      }
                                      toolTiplocation="top"
                                      toolTipMessage={
                                        'Division mapped to user select to switch the divisions'
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    <>
                      {state && state.state.status && (
                        <StatusBlock
                          type={state.state.status}
                          message={state.state.message}
                        />
                      )}
                      {children}
                    </>
                  </Col>
                </motion.div>
              </div>
            </div>
          </Container>

          {showMarker && (
            <div className="floating-button">
              <div className="button">
                <motion.div
                  inital={{ rotate: 0 }}
                  animate={{ rotate: floatingSideBar ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  onClick={() => setfloatingSideBar(!floatingSideBar)}
                >
                  <CaretRightFill size={15} />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </TopBarLayout>
    </>
  );
}

export default PublicLayout;
