/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import api from '@ais/api';
import {
  Col,
  ConfirmToggle,
  DeleteButton,
  EditButton,
  LoadingComponent,
  NewButton,
  Row,
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ais/components';

import { buildGraphQLQueryForDataTable } from '@ais/graphql/BuildGPLQuery';
import { flattenArray } from '@ais/utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ArrowDownUp,
  CaretDown,
  CaretUpFill,
  Clipboard2Data,
  ExclamationTriangle,
} from 'react-bootstrap-icons';

/**
 * 
 * title -> title of the card 
 * subtitle -> subtitle of the card
 * setSortData -> ?
 * tableData -> data from db in key value pair format 
 * selectKey -> ?
 * select Type -> check box , switch 
 * selectedRowCallBack -> on row click callback
 * CustomheaderComponents -> buttons at right side header
 * filterCallback -> ?
 * filterLabel -> ?
 * refreshCallBack -> when refresh button is clicked ? 
 * deleteCallback -> delete button is clicked ?
 * switchCallback -> switch button trigger ? 
 * editCallback -> editbutton callback ? 
 * newEntryCallback -> when new entry is pressed 
 * suffix -> suffix of the table say user.
 * 
 * tableStructure -> {
    queryType: 'listUserProfileByPaging',
    columns: [
      { key: 'id', type: 'uuid', show: false, label: 'id' },
      { key: 'username', type: 'string', show: false, label: 'username' },
      { key: 'firstName', type: 'string', show: true, label: 'first name' },
      { key: 'lastName', type: 'string', show: true, label: 'last name' },
      { key: 'createdAt', type: 'date', show: true, label: 'Created AT' },
    ],
    paging: { pageNo: 1, size: 10 },
    sorting: { field: 'username', direction: 'DESC' },
    filters: [{ field: 'username', operator: 'EQUAL', value: 'admin' }],
  }}
* createLabel -> label for create button
* componentMap -> ?
* inline -> ?
* overflow -> ?
 */

const TableV2 = (props) => {
  const {
    title,
    subTitle,
    setSortData,
    tableData = {},
    selectKey,
    selectType,
    selectedRowCallback,
    customHeaderComponents,
    filterCallback,
    filterLabel,
    refreshCallback,
    deleteCallback,
    switchCallback,
    editCallback,
    newEntryCallback,
    suffix = '',
    tableStructure,
    createlabel,
    componentMap,
    inline = false,
    overflow = false,
  } = props;
  const [tData, setTableData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [__isFirstPage, SetIsFirst] = useState(true);
  const [__isLastPage, SetIsLast] = useState(false);
  const [sortData, storeSortData] = useState({});
  const [pageData, setPageData] = useState({});
  const [totaldatacount, setTotalDataCount] = useState(0);
  const [selectedKey, setSelectedKey] = useState([]);
  const [GQLquery, setGQLquery] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState(false);
  const [pageNo, setpageNo] = useState(1);
  const [pageSize, setpageSize] = useState(10);
  const [totalElements, settotalElements] = useState(0);
  const [deleteLoading, setdeleteLoading] = useState(true);
  const [callbackerror, setcallbackerror] = useState(null); // to store and show button related errors like export / delete etc.,

  const loadData = async (query) => {
    const variables = {
      pageNo: pageNo,
      size: pageSize,
      sort: sortData,
    };

    const { loading, data, error } = await api.graphql(query, variables);
    setisError(error);
    setisLoading(loading);
    if (data) setTableData(data[tableStructure.queryType]);
  };

  const refreshCallBackevent = () => {
    setSelectedKey([]);
    if (refreshCallback) refreshCallback();
    else {
      const variables = {
        pageNo: pageNo,
        size: pageSize,
        sort: sortData,
      };

      loadData(GQLquery, variables);
    }
  };

  useEffect(() => {
    //convert the json to grahpqlQuery

    if (tableStructure != null) {
      setisLoading(true);
      const gql = buildGraphQLQueryForDataTable(tableStructure);
      setGQLquery(gql);
      storeSortData(tableStructure['sorting']);
      setpageNo(tableStructure.paging['pageNo']);
      setpageSize(tableStructure.paging['size']);

      setHeaderData(tableStructure['columns']);
      // have to send sort key & filter
      loadData(gql);
    }
  }, [tableStructure]);

  useEffect(() => {
    setisLoading(true);
    if (GQLquery != null && 'field' in sortData) {
      loadData(GQLquery);
    }
  }, [pageNo, sortData]);

  useEffect(() => {
    const tempData = tableData.length > 0 || tData;
    if (Array.isArray(tempData)) return;
    if (tempData !== undefined && 'items' in tempData) {
      const content = flattenArray(tempData['items']);
      const totalPages = tempData['totalPages'];
      const totalElements = tempData['totalElements'];
      const numberOfElements = tempData['items'].length;
      const isLast = tempData['last'];
      const isfirst = tempData['first'];
      setTableData(content);
      SetIsFirst(isfirst);
      SetIsLast(isLast);
      setPageData(totalPages);
      setTotalDataCount(numberOfElements);
      settotalElements(totalElements);
    }
  }, [tData, tableData]);

  const sortDataByKey = (id, orderBy) => {
    // setSortKey({
    //   field: id,
    //   orderBy: orderBy
    // }); key: "username", direction: "DESC"

    storeSortData({
      field: id,
      direction: orderBy,
    });

    if (setSortData) setSortData(sortData);
  };

  const selectAllRow = (e) => {
    let arr = [];
    if (e.target.checked) {
      tData.forEach((data) => {
        arr.push(data[selectKey]);
      });
    }

    setSelectedKey(arr);
  };

  const triggerSelectRow = (id) => {
    const index = selectedKey.indexOf(id);
    if (index > -1) {
      // only splice array when item is found
      const key = selectedKey.filter(function (item) {
        return item !== id;
      });
      setSelectedKey(key);
    } else {
      if (selectType === 'checkbox') {
        setSelectedKey([...selectedKey, id]);
      } else {
        setSelectedKey([id]);
      }
    }
  };

  useEffect(() => {
    if (selectedRowCallback) selectedRowCallback(selectedKey);
  }, [selectedKey]);

  useEffect(() => {}, []);

  const newentrybutton = (
    <>
      {newEntryCallback && (
        <Col span="auto">
          <NewButton
            type="button"
            onClick={() => newEntryCallback()}
            label={createlabel || 'Create ' + suffix}
          />
        </Col>
      )}
    </>
  );

  const HeaderButtons = (
    <>
      {deleteCallback && (
        <Col span="auto">
          <DeleteButton
            loading={deleteLoading}
            callback={async () => {
              if (!deleteLoading && deleteCallback) {
                setdeleteLoading(true);
                try {
                  const response = await deleteCallback(selectedKey);
                  console.log(response);
                } catch (err) {
                  console.error(err.message);
                  setcallbackerror(err.message);
                } finally {
                  setdeleteLoading(false);
                }
              }
            }}
            disabled={selectedKey.length > 0 ? false : true}
          >
            Delete {suffix}
          </DeleteButton>
        </Col>
      )}

      {editCallback && (
        <Col span={'auto'}>
          <EditButton
            type="button"
            onClick={() => editCallback(selectedKey)}
            disabled={selectedKey.length === 1 ? false : true}
            label={`Edit ${suffix}`}
          />
        </Col>
      )}
    </>
  );

  const mergedHeaders = (
    <>
      {!inline && HeaderButtons}
      {newentrybutton}
      {customHeaderComponents}
    </>
  );

  const pagingCallback = (page) => {
    setpageNo(page);
  };

  const renderComponent = (val, tdata, header) => {
    switch (header.type) {
      case 'text':
      case 'string':
        return <span>{val}</span>;
      case 'link':
        return (
          <span
            onClick={() => {
              if (header.callback) header.callback(val, tdata);
            }}
            className={`link fis-secondary cursor-pointer`}
          >
            {val}
          </span>
        );
      case 'date':
        return <span>{moment(val).format('DD/MM/YYYY hh:mm A')}</span>;
      case 'custom':
        if (typeof header.component === 'function') {
          return header.component({ id: val, key: val, values: tdata });
        } else if (header.component && componentMap[header.component]) {
          return React.createElement(componentMap[header.component], {
            id: val,
            values: tdata,
          });
        } else return <></>;
      default:
        return <>{val}</>;
    }
  };

  return (
    <>
      <div
        className={`custom-datatable ${totaldatacount.length > 3 ? 'table-responsive' : ''}  table-card`}
      >
        <TableCard
          title={`${title}`}
          count={` ${
            selectedKey.length > 0
              ? selectedKey.length + ' / ' + totalElements
              : totalElements
          } `}
          className={``}
          subtitle={subTitle}
          customHeaderComponents={mergedHeaders}
          table={true}
          totalElements={pageData * pageSize}
          pageSize={pageSize}
          currentElement={pageNo}
          pagingCallback={pagingCallback}
          showPaging={totalElements > pageSize}
          filterLabel={filterLabel}
          filterCallback={filterCallback}
          refreshCallBack={() => refreshCallBackevent()}
        >
          <div className="custom-card-datatable">
            <Table>
              <TableHeader className={`table-light`}>
                <TableRow className="table-row header bs-border-bottom">
                  <TableHead
                    className="table-cell width-50 first-column  bs-border-right"
                    hidden={inline && selectType !== 'switch'}
                  >
                    {selectType === 'checkbox' && (
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={'no-value'}
                        onClick={(e) => selectAllRow(e)}
                      />
                    )}
                  </TableHead>
                  {headerData.length > 0 &&
                    headerData.map((header, index) => {
                      if (
                        ('hidden' in header && header.hidden) ||
                        ('show' in header && !header.show)
                      ) {
                        return <></>;
                      } else {
                        return (
                          <TableHead
                            key={index}
                            className={`table-cell position-relative draggable ${index < headerData.length && 'bs-border-right'}`}
                            style={
                              header['width'] && `width : ${header['width']}px`
                            }
                          >
                            <Row align="center" justify="between" nowrap={true}>
                              <Col span="auto">{header['label']}</Col>

                              {'sort' in header && !header.sort ? (
                                <></>
                              ) : (
                                <Col
                                  span="auto"
                                  className={`${(sortData !== null && sortData['field'] === header['key']) || 'show-only-hover'}`}
                                >
                                  {sortData == null ||
                                  sortData['field'] !== header['key'] ? (
                                    <ArrowDownUp
                                      size={15}
                                      onClick={() =>
                                        sortDataByKey(header['key'], 'DESC')
                                      }
                                      className="flex-end sort-key align-center cursor-pointer"
                                    />
                                  ) : (
                                    <>
                                      {sortData !== null &&
                                      sortData['direction'] === 'DESC' &&
                                      sortData['field'] === header['key'] ? (
                                        <CaretUpFill
                                          size={15}
                                          onClick={() =>
                                            sortDataByKey(header['key'], 'ASC')
                                          }
                                          className="flex-end sort-key align-center cursor-pointer"
                                        />
                                      ) : (
                                        <CaretDown
                                          size={15}
                                          onClick={() =>
                                            sortDataByKey(header['key'], 'DESC')
                                          }
                                          className="flex-end sort-key align-center cursor-pointer"
                                        ></CaretDown>
                                      )}
                                    </>
                                  )}
                                </Col>
                              )}

                              {/* {headerData.length - 1 != index && (
                                <div className="draggable-border-right position-absolute r-10"></div>
                              )} */}
                            </Row>
                          </TableHead>
                        );
                      }
                    })}
                </TableRow>
              </TableHeader>
              {isError || isLoading ? (
                <>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={headerData.length}>
                        <div
                          className={`display-flex justify-center items-center`}
                        >
                          {isError && (
                            <>
                              <div>
                                <ExclamationTriangle size={30} color="yellow" />
                              </div>
                              &nbsp; &nbsp; &nbsp;
                              <div
                                className={`display-flex align-items-center overflow-scroll`}
                              >
                                {`
                           Error processing the request please contact administrator.(${isError})
                           `}
                              </div>
                            </>
                          )}
                          {isLoading && <LoadingComponent />}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </>
              ) : (
                <TableBody>
                  {totaldatacount === 0 ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={headerData.length}>
                          <div className={`display-flex justify-center`}>
                            <>
                              <div>
                                <Clipboard2Data size={30} color="blue" />
                              </div>
                              &nbsp; &nbsp; &nbsp;
                              <div
                                className={`display-flex align-items-center overflow-scroll`}
                              >
                                {`
                          No data found for resource identifier : ${suffix}
                           `}
                              </div>
                            </>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      {[...Array(totaldatacount)].map((__, index) => {
                        const tdata = tData[index];
                        const selectedData = tdata && tdata[selectKey];
                        if (tdata === undefined && tdata === null) return <></>;
                        else
                          return (
                            <TableRow
                              key={index}
                              onClick={() => triggerSelectRow(selectedData)}
                              className={`table-row ${inline || 'hoverable'} bs-border-bottom custom-table-${index} ${
                                selectedKey.includes(selectedData)
                                  ? 'active'
                                  : ''
                              }`}
                            >
                              <TableCell
                                className="table-cell width-50 first-column"
                                hidden={inline}
                              >
                                <input
                                  type={selectType}
                                  key={totaldatacount + index}
                                  className="form-check-input"
                                  value={selectedData || selectKey}
                                  readOnly={true}
                                  checked={
                                    selectedKey.includes(selectedData)
                                      ? true
                                      : false
                                  }
                                />
                              </TableCell>

                              {headerData.map((header, i) => {
                                const key = header['key'];
                                const width = header['width'];
                                let val = null;
                                let tselectKey = null;
                                if (key && tdata) val = tdata[key];
                                if (selectKey && tdata)
                                  tselectKey = tdata[selectKey];

                                if (selectType === 'switch' && i === 0) {
                                  return (
                                    <TableCell className="table-cell width-50 first-column">
                                      <div>
                                        <ConfirmToggle
                                          checked={val}
                                          id={tselectKey}
                                          callback={(e) => {
                                            if (switchCallback)
                                              switchCallback(e);
                                          }}
                                        />
                                      </div>
                                    </TableCell>
                                  );
                                }

                                if (
                                  ('hidden' in header && header.hidden) ||
                                  ('show' in header && !header.show)
                                ) {
                                  // eslint-disable-next-line array-callback-return
                                  return;
                                } else {
                                  return (
                                    <TableCell
                                      key={i}
                                      className={`table-cell`}
                                      style={width && `maxWidth: ${width}px`}
                                    >
                                      {renderComponent(
                                        props[key] ? props[key] : val,
                                        tdata,
                                        header,
                                      )}
                                    </TableCell>
                                  );
                                }
                              })}
                            </TableRow>
                          );
                      })}
                    </>
                  )}
                </TableBody>
              )}
            </Table>
          </div>
        </TableCard>
      </div>
    </>
  );
};

export default TableV2;
