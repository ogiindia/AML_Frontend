// import { Pagination } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Col } from '../../components/ui/Col';
import { Input } from '../../components/ui/input';
import { Row } from '../../components/ui/Row';
import { Heading } from '../Typography';

export type CardProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
  children?: React.Component;
  title?: string;
  collapsible?: boolean;
  isCollapsed: boolean;
  cardBodyClassName?: string;
  subTitle?: string;
  count?: number;
  customHeaderComponents?: React.Component;
  table?: boolean;
  filterCallback?: () => void;
  filterLabel?: () => void;
  refreshCallback?: () => void;
  totalElements?: number;
  currentElement?: number;
  pagingCallback?: () => void;
  pageSize?: number;
  showPaging?: boolean;
} & React.ComponentProps<'div'>;

export function CustomCard({
  children,
  title,
  collapsible,
  isCollapsed,
  className,
  cardBodyClassName,
  subTitle,
  count,
  customHeaderComponents,
  table,
  filterCallback,
  filterLabel,
  refreshCallback,
  totalElements,
  currentElement,
  pagingCallback,
  pageSize,
  showPaging,
}: CardProps) {
  const [isOpened, SetOpened] = useState(true);

  useEffect(() => {
    SetOpened(!isCollapsed);
  }, [isCollapsed]);

  return (
    <Card>
      <div className={`row custom-card ${className ? className : ''}`}>
        <Col>
          <div className="card">
            <CardHeader>
              {title && (
                <div
                  className={`card-header position-relative ${collapsible && 'cursor-pointer'}`}
                  onClick={() => collapsible && SetOpened(!isOpened)}
                >
                  <Row>
                    <Col
                      className="flex-center"
                      lg={`${customHeaderComponents ? 6 : 12}`}
                      md={`${customHeaderComponents ? 6 : 12}`}
                      span={`${customHeaderComponents ? 6 : 12}`}
                    >
                      <Row justify="between" align="center">
                        <Col span="auto">
                          <div
                            className={`${collapsible ? 'flex-center pr-10 cursor-pointer flex-1' : ''}`}
                          >
                            <Heading
                              title={`${title} ${count ? '(' + count + ')' : ''}`}
                              subHeading={subTitle}
                            />
                          </div>
                        </Col>
                        <Col span="1">
                          <div className={`flex-pointer`}>
                            {collapsible ? (
                              !isOpened ? (
                                <ChevronUp className={``} size={16} />
                              ) : (
                                <ChevronDown className={``} size={16} />
                              )
                            ) : (
                              <></>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={'6'} lg={'6'} md={'6'}>
                      {customHeaderComponents && (
                        <>
                          <div className="flex-end pt-1 card-header-button-location">
                            {refreshCallback && (
                              <button
                                className={`custom-reload-button btn btn-outline`}
                                onClick={refreshCallback}
                              >
                                <RefreshCcw size={20} />
                              </button>
                            )}
                            {customHeaderComponents}
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    {table && (
                      <>
                        <Col
                          span={'7'}
                          padding={false}
                          className="mt-2 align-items-sm-stretch "
                        >
                          <Input
                            type={'text'}
                            placeholder={`Filter by ${
                              filterLabel ? filterLabel : ''
                            }`}
                            className={`inner-box-shadow`}
                            onChange={filterCallback}
                          />
                        </Col>

                        <Col
                          span={'5'}
                          className="mt-2 flex-end align-center justify-content-sm-end "
                        >
                          <div>
                            {/* {showPaging && (
                              <Pagination
                                current={currentElement}
                                onChange={pagingCallback}
                                total={totalElements}
                                showLessItems
                              />
                            )} */}
                          </div>
                          <div className="flex">
                            <div className="me-3">
                              {/* <PopOver size={20} show={false}>
                              Hello world
                            </PopOver> */}
                            </div>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {children && (
                <AnimatePresence initial={false}>
                  {isOpened && (
                    <motion.div
                      className={`${table || 'card-body'}  ${cardBodyClassName ? cardBodyClassName : ''}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: table ? 'scroll' : 'hidden' }}
                    >
                      {isOpened && children && (
                        <div>
                          <div className="">{children}</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </CardContent>
          </div>
        </Col>
      </div>
    </Card>
  );
}

// export default Card;
