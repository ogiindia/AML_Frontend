import api from '@ais/api';
import { jsonToGraphQLQuery } from '@ais/graphql/JsonToGrahpql';
import { sortArray } from '@ais/utils';
import * as React from 'react';
import { Col } from '../../components/ui/Col';
import { Label } from '../../components/ui/label';
import { Row } from '../../components/ui/Row';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { IconButton } from '../Button';
import { InlineStatusText } from '../Typography';
import { InputHelper } from '../Typography/InputHelper';

interface CustomSelectProps {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e) => void;
  tooltip?: string;
  error?: string;
  type?: string;
  url?: string;
  data?: {} | any;
  dataMap?: [] | any[];
  className?: string;
  backEndCallType?: string;
  customButtons?: [] | any;
  args?: {} | any;
}

export function CustomSelect({
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
  args,
  className,
  backEndCallType = 'GRAPHQL',
  customButtons = [],
  ...props
}: CustomSelectProps & React.ComponentProps<"input">) {
  const [isReady, setIsReady] = React.useState(false);

  const searchRef = React.useRef(null);


  const defaultPlaceholder = {
    name: '0',
    value: placeholder ? placeholder : `Select a ${label}`,
  };

  const [optionData, setOptionData] = React.useState([defaultPlaceholder]);


  const [query, setQuery] = React.useState('');
  const filteredOptions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return optionData;
    return optionData.filter((i) =>
      i.value.toString().toLowerCase().includes(q) ||
      i.name.toString().toLowerCase().includes(q)
    );
  }, [optionData, query]);

  /**
   * 💡 Fix 1: Use functional updates — avoids stale "optionData"
   */
  const setData = (updater) => {
    setOptionData((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );
  };

  /**
   * Load static data passed as prop
   */
  React.useEffect(() => {
    if (data !== undefined) {
      setData([
        defaultPlaceholder,
        ...data,
      ]);
    }
    setIsReady(true);
  }, [data]);


  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      searchRef.current?.focus();
    }, 15);
    return () => clearTimeout(t);
  }, [open]);


  /**
   * Load backend data (GraphQL or REST)
   */
  React.useEffect(() => {
    if (!url) return;

    if (backEndCallType === 'GRAPHQL') {
      if (!dataMap) {
        throw new Error(`Invalid Select Request for field ${name}`);
      }

      const dataMapLength = Object.keys(dataMap).length;

      const json = {
        query: {
          [url]: {
            __args: args || {},
            ...dataMap,
          },
        },
      };

      const gqlquery = jsonToGraphQLQuery(json);

      api.graphql(gqlquery).then((res) => {
        const responseData = res.data;
        let options: any[] = [];

        if (responseData && responseData[url]?.length > 0) {
          responseData[url].forEach((d) => {
            let obj: any = {};
            Object.keys(d).forEach((key, idx) => {
              if (idx === 0) {
                obj["name"] = d[key];
                if (dataMapLength === 1) obj["value"] = d[key];
              } else if (idx === 1) {
                obj["value"] = d[key];
              }
            });
            options.push(obj);
          });
        }

        /** FIX: functional update */
        setData((prev) => [...prev, ...options]);
      });
    } else {
      /** REST API load */
      api.get(url).then((res) => {
        if (!res || res.length === 0) return;

        let options = [];

        res.forEach((d) => {
          if (dataMap) {
            options.push({
              name: d[dataMap["name"]],
              value: d[dataMap["value"]],
            });
          } else {
            options.push({
              name: d["name"],
              value: d["value"],
            });
          }
        });

        /** FIX: functional update */
        setData((prev) => [...prev, ...options]);
      });
    }

    setIsReady(true);
  }, [url]);

  /**
   * 💡 Fix 2: Sync "value" AFTER async data loads
   * Ensures dropdown shows the selected option
   */
  React.useEffect(() => {
    if (!value) return;
    if (optionData.length <= 1) return;

    const exists = optionData.some(
      (o) => o.name?.toString() === value?.toString()
    );

    // if (exists && onChange) {
    //   onChange({
    //     target: {
    //       name,
    //       value,
    //     },
    //   });
    // }
  }, [optionData]);

  const onChangeValue = (value: string) => {
    console.log("onchange triggered : " + value);
    if (onChange) {
      onChange({
        target: {
          name,
          value: value === '0' ? '' : value,
        },
      });
    }
  };


  React.useEffect(() => {
    console.log(value);
  }, [value]);


  return (
    <>
      {isReady && (
        <Row gap="3">
          {label && (
            <Col span="12">
              <Label htmlFor={id} className="form-label flex-1">
                {label}
              </Label>
            </Col>
          )}

          <Col span="12">
            <Row gap="0" align="center">
              <Col padding={false} span="flex">

                <Select
                  onValueChange={onChangeValue}
                  value={value}   // <-- Controlled only (no defaultValue)
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={defaultPlaceholder.value}
                      {...props}
                    />
                  </SelectTrigger>

                  <SelectContent>

                    {/* 🔍 Search Box (inside dropdown) */}
                    {
                      optionData.length > 5 && (
                        <div className="p-2 border-b bg-white sticky top-0 z-50"
                          onPointerDown={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          onKeyUp={(e) => e.stopPropagation()}
                          onKeyPress={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={query}
                            tabIndex={-1}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search…"
                            className="w-full px-2 py-1 border rounded text-sm"
                            autoFocus
                            ref={searchRef}
                          />
                        </div>
                      )
                    }


                    {sortArray(optionData, 'name').map((dt, index) => {
                      const isVisible = filteredOptions.includes(dt);

                      return <SelectItem
                        key={`${dt.name}-${index}`}
                        value={dt.name.toString()}
                        className={`${isVisible ? "" : "hidden"}`}
                      >
                        {dt.value}
                      </SelectItem>
                    }

                    )}


                    {filteredOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No results found.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </Col>

              {customButtons.map((item, i) => (
                <Col span="1" key={i}>
                  <IconButton icon={item.icon} onClick={item.render} />
                </Col>
              ))}

              {tooltip && (
                <Col span="12">
                  <InputHelper text={tooltip} />
                </Col>
              )}
            </Row>
          </Col>

          {error && (
            <Col span="12">
              <InlineStatusText text={error} type="error" />
            </Col>
          )}
        </Row>
      )}
    </>
  );
}
