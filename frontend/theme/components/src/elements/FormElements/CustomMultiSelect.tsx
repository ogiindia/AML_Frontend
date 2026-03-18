import api from '@ais/api';
import { jsonToGraphQLQuery } from '@ais/graphql/JsonToGrahpql';
import { sortArray } from '@ais/utils';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Col } from '../../components/ui/Col';
import { Label } from '../../components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import { Row } from '../../components/ui/Row';
import { cn } from '../../lib/utils';
import { IconButton } from '../Button';
import { InlineStatusText } from '../Typography';
import { InputHelper } from '../Typography/InputHelper';

interface SelectOption {
  name: string | number;
  value: string | number;
}

interface CustomMultiSelectProps {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string[] | string;
  onChange?: (e) => void;
  tooltip?: string;
  error?: string;
  url?: string;
  data?: SelectOption[];
  dataMap?: Record<string, string> | any[];
  className?: string;
  backEndCallType?: string;
  customButtons?: any[];
  args?: Record<string, any>;
  maxDisplayItems?: number;
}

export function CustomMultiSelect({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
  tooltip,
  error,
  url,
  data,
  dataMap,
  args,
  className,
  backEndCallType = 'GRAPHQL',
  customButtons = [],
  maxDisplayItems = 2,
  ...props
}: CustomMultiSelectProps & React.ComponentProps<'input'>) {
  const [open, setOpen] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [optionData, setOptionData] = React.useState<SelectOption[]>([]);
  const [query, setQuery] = React.useState('');
  const searchRef = React.useRef<HTMLInputElement>(null);

  const selectedValues = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((v) => v.toString());
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }, [value]);

  const setData = (updater: SelectOption[] | ((prev: SelectOption[]) => SelectOption[])) => {
    setOptionData((prev) =>
      typeof updater === 'function' ? updater(prev) : updater,
    );
  };

  const mergeUniqueOptions = React.useCallback(
    (current: SelectOption[], incoming: SelectOption[]) => {
      const map = new Map<string, SelectOption>();

      [...current, ...incoming].forEach((item) => {
        map.set(item.name.toString(), item);
      });

      return Array.from(map.values());
    },
    [],
  );

  React.useEffect(() => {
    if (data !== undefined) {
      setData((prev) => mergeUniqueOptions(prev, data));
    }
    setIsReady(true);
  }, [data, mergeUniqueOptions]);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      searchRef.current?.focus();
    }, 15);
    return () => clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!url) return;

    if (backEndCallType === 'GRAPHQL') {
      if (!dataMap) {
        throw new Error(`Invalid MultiSelect Request for field ${name}`);
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
        const options: SelectOption[] = [];

        // if (responseData && responseData[url]?.length > 0) {
        //   responseData[url].forEach((d) => {
        //     const obj: Record<string, string | number> = {};
        //     Object.keys(d).forEach((key, idx) => {
        //       if (idx === 0) {
        //         obj.name = d[key];
        //         if (dataMapLength === 1) obj.value = d[key];
        //       } else if (idx === 1) {
        //         obj.value = d[key];
        //       }
        //     });
        //     options.push(obj);
        //   });
        // }

        setData((prev) => mergeUniqueOptions(prev, options));
      });
    } else {
      api.get(url).then((res) => {
        if (!res || res.length === 0) return;

        const options: SelectOption[] = [];

        res.forEach((d) => {
          if (dataMap) {
            options.push({
              name: d[dataMap['name']],
              value: d[dataMap['value']],
            });
          } else {
            options.push({
              name: d.name,
              value: d.value,
            });
          }
        });

        setData((prev) => mergeUniqueOptions(prev, options));
      });
    }

    setIsReady(true);
  }, [args, backEndCallType, dataMap, mergeUniqueOptions, name, url]);

  const filteredOptions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return optionData;

    return optionData.filter((item) =>
      item.value.toString().toLowerCase().includes(q) ||
      item.name.toString().toLowerCase().includes(q),
    );
  }, [optionData, query]);

  const optionMap = React.useMemo(() => {
    const map = new Map<string, SelectOption>();
    optionData.forEach((option) => {
      map.set(option.name.toString(), option);
    });
    return map;
  }, [optionData]);

  const selectedLabels = React.useMemo(
    () =>
      selectedValues.map((selected) => {
        const option = optionMap.get(selected);
        return option ? option.value.toString() : selected;
      }),
    [optionMap, selectedValues],
  );

  const displayedSelection = React.useMemo(() => {
    if (selectedLabels.length === 0) {
      return placeholder || `Select ${label ? label.toLowerCase() : 'options'}`;
    }

    if (selectedLabels.length <= maxDisplayItems) {
      return selectedLabels.join(', ');
    }

    const visible = selectedLabels.slice(0, maxDisplayItems).join(', ');
    const remainder = selectedLabels.length - maxDisplayItems;
    return `${visible} +${remainder}`;
  }, [label, maxDisplayItems, placeholder, selectedLabels]);

  const onSelectValue = (selected: string) => {
    const nextValues = selectedValues.includes(selected)
      ? selectedValues.filter((item) => item !== selected)
      : [...selectedValues, selected];

    if (onChange) {
      onChange({
        target: {
          name,
          value: nextValues,
        },
      });
    }
  };

  const clearSelection = () => {
    if (!onChange) return;
    onChange({
      target: {
        name,
        value: [],
      },
    });
  };

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
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        'w-full justify-between truncate font-normal',
                        !selectedValues.length && 'text-muted-foreground',
                        className,
                      )}
                      {...props}
                    >
                      <span className="truncate text-left">{displayedSelection}</span>
                      <ChevronDown className="ml-2 size-4 shrink-0 opacity-60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    {optionData.length > 5 && (
                      <div
                        className="sticky top-0 z-10 border-b bg-background p-2"
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
                          placeholder={`Search ${label ? label.toLowerCase() : 'options'}...`}
                          className="w-full rounded border px-2 py-1 text-sm"
                          autoFocus
                          ref={searchRef}
                        />
                      </div>
                    )}

                    <div className="max-h-64 overflow-y-auto p-1">
                      {sortArray(filteredOptions, 'name').map((option, index) => {
                        const optionKey = option.name.toString();
                        const isSelected = selectedValues.includes(optionKey);

                        return (
                          <button
                            key={`${optionKey}-${index}`}
                            type="button"
                            onClick={() => onSelectValue(optionKey)}
                            className={cn(
                              'hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm',
                              isSelected && 'bg-accent/60',
                            )}
                          >
                            <Checkbox checked={isSelected} className="pointer-events-none" />
                            <span className="flex-1 truncate">{option.value.toString()}</span>
                            {isSelected && <Check className="size-4 opacity-70" />}
                          </button>
                        );
                      })}

                      {filteredOptions.length === 0 && (
                        <div className="px-2 py-2 text-sm text-muted-foreground">
                          No results found.
                        </div>
                      )}
                    </div>

                    {selectedValues.length > 0 && (
                      <div className="border-t p-1">
                        <button
                          type="button"
                          onClick={clearSelection}
                          className="text-muted-foreground hover:text-foreground w-full rounded-sm px-2 py-1 text-left text-xs"
                        >
                          Clear selection
                        </button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
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