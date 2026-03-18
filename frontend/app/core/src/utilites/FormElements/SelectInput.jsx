/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import api from '@ais/api';
import { jsonToGraphQLQuery } from '@ais/graphql';
import { useEffect, useRef, useState } from 'react';
import { BACKEND_CALL_TYPE } from '../../config';
import FormToolTip from './FormToolTip';

export const SelectInput = ({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
  tooltip,
  error,
  type,
  url,
  data,
  dataMap,
  className,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)

  const [show, setShow] = useState(true);
  const target = useRef(null);
  const [optionData, setData] = useState([
    {
      name: '',
      value: placeholder ? placeholder : `Select a ${label}`,
    },
  ]);

  useEffect(() => {
    setData([{
      name: '',
      value: placeholder ? placeholder : `Select a ${label}`,
    }, ...data]);
  }, [data]);

  useEffect(() => {
    if (url !== undefined) {
      if (BACKEND_CALL_TYPE === 'GRAPHQL') {
        if (dataMap) {
          const json = {
            query: {
              [url]: {
                ...dataMap,
              },
            },
          };

          const gqlquery = jsonToGraphQLQuery(json);

          api.graphql(gqlquery).then((res) => {
            let options = [];

            const responseData = res.data;
            if (responseData && responseData[url] && responseData[url].length > 0) {
              responseData[url].map((d) => {
                var data = {};
                Object.keys(d).map((m, j) => {
                  if (j === 0) {
                    data['name'] = d[m];
                  } else if (j === 1) data['value'] = d[m];
                });

                console.log(data);

                options.push(data);
              });
            }
            setData([...optionData, ...options]);
          });
        } else {
          throw new Error(`invalid Select Request for field ${name}`);
        }
      } else {
        api.get(url).then((res) => {
          let options = [];
          if (res.length > 0) {
            res.map((d, i) => {
              if (dataMap)
                options.push({
                  name: d[dataMap['name']],
                  value: d[dataMap['value']],
                });
              else
                options.push({
                  name: d['name'],
                  value: d['value'],
                });
              setData([...optionData, ...options]);
            });
          }
        });
      }
      //call api yet to implement;
    }
  }, [url]);

  const renderError = error ? (
    <>
      <span className="fis-danger capitalize"> {error} </span>
    </>
  ) : null;

  return (
    <>
      <div className="mb-3">
        <div className="flex">
          {label && (
            <>
              <label htmlFor={id} className="form-label flex-1">
                {label}
              </label>

              <FormToolTip id={id} tooltip={tooltip} />
            </>
          )}
        </div>
        <select
          className={`form-control form-control-md ${className ? className : ''
            }`}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          type={type}
        >
          {optionData &&
            optionData.map((dt, index) => {
              return (
                <option value={dt['name']} key={index}>
                  {dt['value']}
                </option>
              );
            })}
        </select>
        {renderError}
      </div>
    </>
  );
};
