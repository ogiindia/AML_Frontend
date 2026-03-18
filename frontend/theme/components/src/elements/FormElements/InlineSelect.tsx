import { useEffect, useState } from 'react';
import { ToolTip } from '../Typography/ToolTip';

import * as React from 'react';

export function InlineSelect({
  data = [],
  callback,
  selectedValue,
  labelComponent,
  toolTipMessage,
  toolTiplocation = 'left',
}: any & React.ComponentProps<'div'>) {
  const [SelectedOptionData, setSelectedOptionData] = useState();

  const onSelectEvent = (e) => {
    console.log(e);
    console.log(e.target.value);
    setSelectedOptionData(e.target.value);
    if (callback) callback(e.target.value);
  };

  useEffect(() => {
    setSelectedOptionData(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    if (data.length === 1 && callback) callback(data[0].name);
  }, [data]);

  return (
    <>
      {data.length > 0 && (
        <div>
          <div className="p-1">
            <div className="module-block">
              {toolTipMessage ? (
                <>
                  <ToolTip location={toolTiplocation} message={toolTipMessage}>
                    <span className="fis-primary align-center px-1">
                      {labelComponent}
                    </span>
                  </ToolTip>
                </>
              ) : (
                <>
                  <span className="fis-primary align-center px-1">
                    {labelComponent}
                  </span>
                </>
              )}

              {data.length === 1 ? (
                <>
                  <span className="fis-secondary"> {data[0]['value']} </span>
                </>
              ) : (
                <select
                  className="form-select"
                  defaultValue={SelectedOptionData}
                  onChange={(e) => onSelectEvent(e)}
                >
                  {data.map((d, i) => {
                    return (
                      <option key={i} name={d.name} value={d.name}>
                        {d.value}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
