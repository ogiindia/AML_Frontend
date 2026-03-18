/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Card } from '@ais/components';
import { filterJson } from '@ais/utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CaretDown, CaretUpFill } from 'react-bootstrap-icons';

const Table = (props) => {
  const {
    title,
    subTitle,
    headers,
    setSortData,
    tableData,
    selectKey,
    selectType,
    selectedRowCallback,
    customHeaderComponents,
    filterCallback,
    filterLabel,
    refreshCallback,
    deleteCallback,
    editCallback,
    newEntryCallback,
    suffix,
    createlabel,
  } = props;
  const [tabledata, setTableData] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [sortkey, setSortKey] = useState(null);
  const [__datalength, setDataLength] = useState(0);
  const [__isfirst, SetIsFirst] = useState(true);
  const [__islast, SetIsLast] = useState(false);
  const [__sortData, storeSortData] = useState({});
  const [__pageData, setPageData] = useState({});
  const [__totalPages, __setTotalPages] = useState(0);
  const [totaldatacount, setTotalDataCount] = useState(0);
  const [selectedKey, setSelectedKey] = useState([]);

  const extractHeader = (content) => {
    //form header
    const whitelistedHeader = headers || [];
    const firstObj = content.length > 0 && content[0];

    //header format
    // {
    //   id: "userID",
    //   label: "userID",
    //   width: "200",
    //   type: "text",
    //   hidden: true,
    //   mandatory: true,
    // },

    var headerData = [];

    if (firstObj !== undefined) {
      Object.keys(firstObj).map((key) => {
        //check header is customized

        var filteredarray = filterJson(whitelistedHeader, 'id', key);
        console.log(filteredarray, whitelistedHeader);
        if (whitelistedHeader.length > 0) {
          if (filteredarray.length > 0) {
            filteredarray = filteredarray[0];
            headerData.push(filteredarray);
          }
        } else {
          headerData.push({
            id: key,
            label: key,
          });
        }
        return null;
      });

      //map it to the headerstate
      setHeaderData(headerData);

      console.log(headerData);
    }
  };

  useEffect(() => {
    if (tableData !== undefined && 'content' in tableData) {
      const content = tableData['content'];
      const totalPages = tableData['totalPages'];
      const totalElements = tableData['totalElements'];
      const numberOfElements = tableData['numberOfElements'];
      const isLast = tableData['last'];
      const isempty = tableData['empty'];
      const isfirst = tableData['first'];
      const sortJson = tableData['sort'];
      const pageJson = tableData['pageable'];
      console.warn(tableData);
      setDataLength(content.length);
      setTableData(content);
      setPageData(pageJson);
      storeSortData(sortJson);
      SetIsFirst(isfirst);
      SetIsLast(isLast);
      setPageData(totalPages);
      setTotalDataCount(numberOfElements);
      extractHeader(content);
    }
  }, [tableData]);

  const sortDataByKey = (id) => {
    setSortKey(id);
    if (setSortData) setSortData(id);
  };

  const selectAllRow = (e) => {
    let arr = [];
    if (e.target.checked) {
      tabledata.forEach((data) => {
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

  useEffect(() => { }, []);

  const HeaderButtons = (
    <>
      {deleteCallback && (
        <button
          type="button"
          className="btn btn-fis-danger ml-10 mr-10"
          onClick={() => deleteCallback(selectedKey)}
          disabled={selectedKey.length > 0 ? false : true}
        >
          Delete {suffix}
        </button>
      )}

      {editCallback && (
        <button
          type="button"
          className="btn btn-fis-secondary ml-10 mr-10"
          onClick={() => editCallback(selectedKey)}
          disabled={selectedKey.length === 1 ? false : true}
        >
          Edit {suffix}
        </button>
      )}

      {newEntryCallback && (
        <>
          <button
            type="button"
            className="btn btn-fis-primary ml-10 mr-10"
            onClick={() => newEntryCallback()}
          >
            {createlabel || 'Create ' + suffix}
          </button>
        </>
      )}
    </>
  );

  const mergedHeaders = (
    <>
      {HeaderButtons}
      {customHeaderComponents}
    </>
  );

  const renderComponent = (val, header) => {
    switch (header.type) {
      case 'text':
        return <span>{val}</span>;
      case 'date':
        return <span>{moment(val).format('DD/MM/YYYY')}</span>;
      case 'custom':
        // eslint-disable-next-line no-new-func
        const CustomComponent = new Function('props', `return ${header.component}`);
        return <><CustomComponent value={val} {...header.props} /></>;
      default:
        return <>{val}</>;
    }
  };

  return (
    <>
      <div className="custom-datatable table-responsive table-card">
        <Card
          title={`${title}`}
          count={` ${selectedKey.length > 0
            ? selectedKey.length + ' / ' + totaldatacount
            : totaldatacount
            } `}
          className={``}
          subTitle={subTitle}
          customHeaderComponents={mergedHeaders}
          table={true}
          filterLabel={filterLabel}
          filterCallback={filterCallback}
          refreshCallback={refreshCallback}
        >
          <div className="custom-card-datatable">
            <table
              className={`table text-nowrap mb-0 table-centered table-hover`}
            >
              <thead className={`table-light`}>
                <tr className="table-row header bs-border-bottom">
                  <th className="table-cell width-50 first-column  bs-border-right">
                    {selectType === 'checkbox' && (
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onClick={(e) => selectAllRow(e)}
                      />
                    )}
                  </th>
                  {headerData.length > 0 &&
                    headerData.map((header, index) => {
                      if ('hidden' in header && header.hidden) {
                        return <></>;
                      } else {
                        return (
                          <>
                            <th
                              key={index}
                              className="table-cell position-relative draggable"
                              style={{
                                width: `${header['width']
                                  ? header['width'] + 'px'
                                  : '100%'
                                  }`,
                              }}
                            >
                              <div className="flex justify-content-between">
                                <div className="content flex-start">
                                  {header['label']}
                                </div>
                                {sortkey === header['id'] ? (
                                  <CaretUpFill
                                    size={15}
                                    onClick={() => sortDataByKey(header['id'])}
                                    className="flex-end sort-key align-center cursor-pointer"
                                  />
                                ) : (
                                  <CaretDown
                                    size={15}
                                    onClick={() => sortDataByKey(header['id'])}
                                    className="flex-end sort-key align-center cursor-pointer"
                                  ></CaretDown>
                                )}
                                {headerData.length - 1 !== index && (
                                  <div className="draggable-border-right position-absolute r-10"></div>
                                )}
                              </div>
                            </th>
                          </>
                        );
                      }
                    })}
                </tr>
              </thead>

              <tbody>
                {[...Array(totaldatacount)].map((row, index) => {
                  const tdata = tabledata[index];
                  return (
                    <>
                      <tr
                        key={index}
                        onClick={() => triggerSelectRow(tdata[selectKey])}
                        className={`table-row bs-border-bottom custom-table-${index} ${selectedKey.includes(tdata[selectKey]) ? 'active' : ''
                          }`}
                      >
                        <td className="table-cell width-50 first-column">
                          <input
                            type={selectType}
                            key={totaldatacount + index}
                            className="form-check-input"
                            value={tdata[selectKey]}
                            readOnly={true}
                            checked={
                              selectedKey.includes(tdata[selectKey])
                                ? true
                                : false
                            }
                          />
                        </td>

                        {headerData.map((header, i) => {
                          const key = header['id'];
                          const width = header['width'];
                          const val = tdata[key];
                          if ('hidden' in header && header.hidden) {
                            return <></>;
                          } else {
                            return (
                              <td
                                key={i}
                                className="table-cell"
                                style={{
                                  maxWidth: `${header['width']
                                    ? header['width'] + 'px'
                                    : '100%'
                                    }`,
                                }}
                              >
                                {renderComponent(
                                  props[key] ? props[key] : val,
                                  header,
                                )}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Table;
