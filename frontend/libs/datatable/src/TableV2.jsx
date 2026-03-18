/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import api from '@ais/api';
import {
  Col,
  DeleteButton,
  EditButton,
  InlineInput,
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
import {
  filterArrayWithCustomKey,
  flattenArray,
  JsonArrayToArray,
} from '@ais/utils';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ArrowDownUp,
  CaretDown,
  CaretUpFill,
  Clipboard2Data,
} from 'react-bootstrap-icons';

/**
 * columns = {
 *   username: { label: "Username", sortable: true, show: true },
 *   createdAt: { label: "Created", sortable: true, type: "date" },
 *   actions: { label: "Actions", show: true, render: (row) => <Button>Edit</Button> }
 * }
 */

const TableV2 = (props) => {
  const {
    title,
    subTitle,
    setSortData,
    tableData = {},
    selectKey = 'id',
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
    inline = false,
    columns = {},
  } = props;

  const [tData, setTableData] = useState([]);
  const [sortData, setSort] = useState({});
  const [GQLquery, setGQLquery] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [tablefilters, settablefilters] = useState([]);
  const [deletedId, setdeletedId] = useState(null);

  // -----------------------------------------
  // 📡 Data Fetch
  // -----------------------------------------
  const loadData = async (query) => {
    console.log("query");
    setLoading(true);
    setTableData([]);
    setTotalElements(0);
    const variables = {
      pageNo,
      size: pageSize,
      sort: sortData,
      filter: tablefilters,
    };
    const { loading, data, error } = await api.graphql(query, variables);
    setError(error);
    setLoading(loading);
    if (data) {
      const content = data[tableStructure.queryType];
      if (content?.items) {
        setTableData(flattenArray(content.items));
        setTotalElements(content.totalElements);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(tableStructure)
    if (tableStructure) {
      const gql = buildGraphQLQueryForDataTable(tableStructure);
      setGQLquery(gql);
      setSort(tableStructure.sorting || {});
      setPageNo(tableStructure.paging?.pageNo || 1);
      setPageSize(tableStructure.paging?.size || 10);
      settablefilters(tableStructure.filters || []);
      // loadData(gql);
    }
  }, [tableStructure]);

  useEffect(() => {
    if (GQLquery && sortData.field) {
      console.log("into pageNo");
      loadData(GQLquery);
    }
  }, [pageNo, sortData]);

  const refreshCallBackevent = () => {
    setSelectedKeys([]);
    console.log("into refresh callback");
    if (refreshCallback) refreshCallback();
    else if (GQLquery) loadData(GQLquery);
  };

  // -----------------------------------------
  // 🧠 Selection
  // -----------------------------------------
  const selectAllRow = (e) => {
    if (e.target.checked) setSelectedKeys(tData.map((r) => r[selectKey]));
    else setSelectedKeys([]);
  };

  const triggerSelectRow = (id) => {
    if (!id) return;
    setSelectedKeys((prev) =>
      prev.includes(id)
        ? prev.filter((k) => k !== id)
        : selectType === 'checkbox'
          ? [...prev, id]
          : [id],
    );
  };

  useEffect(() => {
    if (selectedRowCallback) selectedRowCallback(selectedKeys);
  }, [selectedKeys]);

  // -----------------------------------------
  // ⚙️ Filtering
  // -----------------------------------------

  const onChangeFilter = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);

    settablefilters((prev) =>
      prev.map((item) =>
        item.field === e.target.name
          ? { ...item, value: e.target.value }
          : item,
      ),
    );
  };

  useEffect(() => {
    console.log(tablefilters)
    if (tablefilters.length > 0 && GQLquery != null && !isLoading && !isError) {
      console.log("table filters");
      loadData(GQLquery);
    }
  }, [tablefilters]);

  // -----------------------------------------
  // ⚙️ Sorting
  // -----------------------------------------
  const toggleSort = (key) => {
    setSort((prev) => {
      const direction =
        prev.field === key && prev.direction === 'ASC' ? 'DESC' : 'ASC';
      const newSort = { field: key, direction };
      if (setSortData) setSortData(newSort);
      return newSort;
    });
  };

  const renderSortIcon = (key) => {
    if (sortData.field !== key)
      return <ArrowDownUp size={14} className="cursor-pointer opacity-50" />;
    return sortData.direction === 'ASC' ? (
      <CaretUpFill size={14} className="cursor-pointer" />
    ) : (
      <CaretDown size={14} className="cursor-pointer" />
    );
  };

  // -----------------------------------------
  // 🧱 Columns setup with show/hide
  // -----------------------------------------

  const dataKeys =
    tableStructure?.columns.length > 0 &&
    JsonArrayToArray(tableStructure?.columns, 'key');

  //  const dataKeys = tData.length > 0 ? Object.keys(tData[0]) : [];
  const allKeys = Array.from(new Set([...dataKeys, ...Object.keys(columns)]));

  // Filter visible columns
  const visibleKeys = allKeys.filter((key) => {
    const col = columns[key];
    if (col?.hidden === true) return false;
    if (col?.show === false) return false;
    return true;
  });

  const renderCell = (row, key, index) => {
    const col = columns[key];
    if (col?.render) return col.render(row, index);
    const val = row[key];
    if (val == null || val === '') return <span className="text-muted">—</span>;
    if (col?.type === 'date') return moment(val).format('DD/MM/YYYY HH:mm');
    return String(val);
  };

  // -----------------------------------------
  // 🧩 Header Buttons
  // -----------------------------------------
  const HeaderButtons = (
    <>
      {deleteCallback && (
        <Col span="auto">
          <DeleteButton
            loading={deleteLoading}
            disabled={selectedKeys.length === 0}
            callback={async () => {
              setDeleteLoading(true);
              const id = await deleteCallback(selectedKeys);
              console.log("deleted ID " + id);
              if (id) {
                setdeletedId(id);
                refreshCallBackevent(); // refresh only when needed return delete id to refresh
              }
              // loadData(GQLquery);
              setDeleteLoading(false);
            }}
          >
            Delete {suffix}
          </DeleteButton>
        </Col>
      )}
      {editCallback && (
        <Col span="auto">
          <EditButton
            disabled={selectedKeys.length !== 1}
            onClick={() => editCallback(selectedKeys)}
            label={`Edit ${suffix}`}
          />
        </Col>
      )}
      {newEntryCallback && (
        <Col span="auto">
          <NewButton
            onClick={newEntryCallback}
            label={createlabel || `Create ${suffix}`}
          />
        </Col>
      )}
      {customHeaderComponents}
    </>
  );

  // -----------------------------------------
  // 🖼️ Render
  // -----------------------------------------
  return (
    <div className="custom-datatable table-card">
      <TableCard
        title={title}
        subtitle={subTitle}
        count={`${selectedKeys.length > 0 ? `${selectedKeys.length} / ${totalElements}` : totalElements}`}
        customHeaderComponents={HeaderButtons}
        table
        totalElements={totalElements}
        pageSize={pageSize}
        currentElement={pageNo}
        pagingCallback={setPageNo}
        showPaging={totalElements > pageSize}
        filterLabel={filterLabel}
        filterCallback={filterCallback}
        refreshCallBack={refreshCallBackevent}
      >
        <div className="custom-card-datatable">
          <Table>
            <TableHeader className="table-light">
              <TableRow>
                {selectType && (
                  <TableHead style={{ width: '30px' }}>
                    {selectType === 'checkbox' && (
                      <input type="checkbox" onChange={selectAllRow} />
                    )}
                  </TableHead>
                )}
                {visibleKeys.map((key) => {
                  const col = columns[key];
                  const filter = filterArrayWithCustomKey(
                    tablefilters,
                    'field',
                    key,
                  );
                  return (
                    <TableHead
                      key={key}
                      className={`${col?.sortable ? 'cursor-pointer' : ''} border-r ${tablefilters.length > 0 && 'align-top'}`}
                    >
                      <Row gap="0">
                        <Row
                          align="center"
                          justify="between"
                          nowrap
                          className="flex-1"
                        >
                          <Col span="auto">{col?.label || key}</Col>
                          {col?.sortable && (
                            <Col span="auto">
                              <span
                                onClick={() => col?.sortable && toggleSort(key)}
                              >
                                {renderSortIcon(key)}
                              </span>
                            </Col>
                          )}
                        </Row>
                        {filter.length > 0 && col?.filter &&
                          filter.map((item, __index) => (
                            <InlineInput
                              className={`bg-white`}
                              key={`${key}-${__index}`}
                              name={key}
                              id={`${key}-${__index}`}
                              value={item['value']}
                              onChange={onChangeFilter}
                            ></InlineInput>
                          ))}
                      </Row>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={visibleKeys.length}>
                    <LoadingComponent />
                  </TableCell>
                </TableRow>
              ) : tData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleKeys.length}>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clipboard2Data size={20} /> {`No data found ${suffix && 'for ' + suffix}`}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tData.map((row, rowIndex) => {
                  const rowId = row[selectKey];
                  if (rowId === deletedId) {
                    return null; // <-- FIX: always return something
                  }

                  return (
                    <TableRow
                      key={rowId}
                      onClick={() => triggerSelectRow(rowId)}
                      className={`table-row ${selectedKeys.includes(rowId) ? 'active' : ''}`}
                    >
                      {selectType && (
                        <TableCell className="width-50">
                          <input
                            type={selectType}
                            checked={selectedKeys.includes(rowId)}
                            readOnly
                          />
                        </TableCell>
                      )}
                      {visibleKeys.map((key) => (
                        <TableCell key={key}>
                          {renderCell(row, key, rowIndex)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );

                })
              )}
            </TableBody>
          </Table>
        </div>
      </TableCard>
    </div>
  );
};

export default TableV2;
