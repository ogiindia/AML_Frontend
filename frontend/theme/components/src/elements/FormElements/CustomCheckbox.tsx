import * as React from 'react';
import { Checkbox } from '../../components/ui/checkbox';
import { Col } from '../../components/ui/Col';
import { Label } from '../../components/ui/label';
import { Row } from '../../components/ui/Row';
import { InlineStatusText, InputHelper } from '../Typography';

export function CustomCheckbox({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
  tooltip,
  error,
  type,
  direction,
  ...props
}: any) {
  const isError = error ? true : false;

  React.useEffect(() => {
    console.log(value);
  }, [value]);

  const onChecked = (value) => {
    if (onChange) {
      console.log(value);
      onChange?.({
        target: {
          name,
          value: value,
        },
      });
    }
  };

  return (
    <div>
      <Row gap="3">
        {label && (
          <Col span="12">
            <Label data-error={isError} htmlFor={id}>
              {label}
            </Label>
          </Col>
        )}
        <Col span="12">
          <Row gap={'1'}>
            <Col padding={false} span="12">
              <Checkbox
                id={id}
                name={name}
                checked={value ? true : false}
                onCheckedChange={onChecked}
                {...props}
              />
            </Col>

            {tooltip && (
              <Col padding={false} span="12">
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
    </div>
  );
}
