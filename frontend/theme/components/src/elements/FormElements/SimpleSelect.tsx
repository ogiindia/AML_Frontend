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
  data?: [] | any;
  className?: string;
}

export function SimpleSelect({
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

  className,

  ...props
}: CustomSelectProps) {
  const [show, setShow] = React.useState(true);
  const target = React.useRef(null);
  const [optionData, setData] = React.useState([
    {
      name: '0',
      value: placeholder ? placeholder : `Select a ${label}`,
    },
  ]);

  React.useEffect(() => {
    setData([
      {
        name: '0',
        value: placeholder ? placeholder : `Select a ${label}`,
      },
      ...data,
    ]);
  }, [data]);

  const onChangeValue = (value) => {
    if (onChange) {
      onChange?.({
        target: {
          name,
          value: value,
        },
      });
    }
  };

  return (
    <>
      <Row gap="3">
        {label && (
          <Col span="12">
            <>
              <Label htmlFor={id} className="form-label flex-1">
                {label}
              </Label>

              {/* <FormToolTip id={id} tooltip={tooltip} /> */}
            </>
          </Col>
        )}
        <Col span="12">
          <Row gap="1">
            <Col padding={false} span="12">
              <Select onValueChange={onChangeValue} defaultValue={value}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      placeholder ? placeholder : `Select a ${label}`
                    }
                    {...props}
                  />
                </SelectTrigger>
                <SelectContent>
                  {optionData &&
                    optionData.length > 0 &&
                    optionData.map((dt, index) => {
                      return (
                        <SelectItem value={dt['name']} key={index}>
                          {dt['value']}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </Col>
            {tooltip && (
              <Col span={'12'}>
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
    </>
  );
}
