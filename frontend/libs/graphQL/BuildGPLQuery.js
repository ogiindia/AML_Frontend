import { hasKey } from '@ais/utils';
import { jsonToGraphQLQuery } from './JsonToGrahpql';
import { VariableType } from './VariableType';

export function buildGraphQLQueryForDataTable(json) {
  const queryType = json.queryType;
  //    const { pageNo, size } = json.paging;
  // const filters = json.filters || [];
  // const sorting = json.sorting;

  //field are in object format
  // const __fields = json.columns
  //   .map((col) => col.key)
  //   .reduce((acc, filter) => {

  //     const keys = col.key

  //     acc[filter] = true;
  //     return acc;
  //   }, {});

  const __fields = json.columns.reduce((acc, col) => {
    const keys = col.key.split('.');
    let current = acc;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = true;
      } else {
        current[key] = current[key] || {};
      }

      current = current[key];
    });
    return acc;
  }, {});

  // const filterString = filters.map(filter => `{field : "${filter.field}"}`);
  // const __sort = sorting ? `{field:"${sorting.field}" ,direction: ${sorting.direction.toUpperCase()}}` : '';

  let gljson = {
    query: {
      __variables: {
        pageNo: 'Int!',
        size: 'Int!',
        sort: 'SortCriteriainput',
        filter: '[FilterCriteriainput]',
      },

      [queryType]: {
        __args: {
          pageNo: new VariableType('pageNo'),
          pageSize: new VariableType('size'),
          sort: new VariableType('sort'),
          filter: new VariableType('filter'),
        },
        items: {
          ...__fields,
        },
        totalElements: true,
        totalPages: true,
        currentPage: true,
        isFirstPage: true,
        isLastPage: true,
      },
    },
  };

  const graphqlQuery = jsonToGraphQLQuery(gljson);
  return graphqlQuery;
}

export function isValidQuery() {
  let glJson = {
    query: {
      __variables: {
        tId: 'String!',
      },
      entityIsValid: {
        __args: {
          tId: new VariableType('tId'),
        },
        isMenu: true,
        tid: true,
        menu: {
          path: true,
          page: true,
        },
      },
    },
  };

  const graphqlQuery = jsonToGraphQLQuery(glJson);

  return graphqlQuery;
}

export function convertType(str) {
  switch (str) {
    case 'text':
      return 'String';
    case 'number':
      return 'Int';
    case 'radio':
      return 'Boolean';
    default:
      return str;
  }
}

export function generateQueryFromFormJson(
  format,
  args,
  isMutation = false,
  headers = {},
) {
  //only first object is allowed
  if (Array.isArray(format)) format = format[0];
  if (!format.query && format.query !== undefined)
    throw new Error(`Invalid Form data provided ${format.title}`);

  var variables = [];

  if (format['data']) {
    let fields = format['data'];

    fields.map((field, index) => {
      if (hasKey(args, field.name)) {
        const tempFields = {
          [field.alias ? field.alias : field.name]: field.gqlType
            ? field.gqlType
            : convertType(field.type),
        };
        variables.push(tempFields);
      }
      return index;
    });
  }

  let tempJson = {
    [isMutation ? 'mutation' : 'query']: {
      __variables: variables,
      [format.query]: {
        __args: args,
        id: true,
        ...headers,
      },
    },
  };

  const gqlQuery = jsonToGraphQLQuery(tempJson);
  return gqlQuery;
}

export function generateDeleteQuery(name) {
  let json = {
    mutation: {
      _variables: {
        id: 'UUID!',
      },
      [name]: {
        __args: {
          id: new VariableType('id'),
        },
      },
    },
  };

  return jsonToGraphQLQuery(json);
}
