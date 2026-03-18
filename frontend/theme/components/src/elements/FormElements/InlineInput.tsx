import { Search } from 'lucide-react';
import * as React from 'react';
import { Col } from '../../components/ui/Col';
import { Input } from '../../components/ui/input';
import { Row } from '../../components/ui/Row';
import { CustomInputProps } from './FormProps';

export function InlineInput({
  type = 'text',
  name,
  className = '',
  onChange,
  id,
  value,
}: CustomInputProps) {

  const [data, setdata] = React.useState();

  React.useEffect(() => {
    if (value) {
      setdata(value);
    }
  }, [value]);

  return (
    <Row align={`center`} justify={`between`} className="inline-text-block basis-full" gap={'0'}>
      <Col span="flex" className="p-2">
        <Input
          type={type}
          name={name}
          className={className}
          onChange={(e) => setdata(e.target.value)}
          id={id}
          value={data}
        />
      </Col>
      <Col span={`auto`}>
        <Search className='size-5 opacity-50 text-muted-foreground cursor-pointer' onClick={() => onChange({
          target: {
            name: name,
            value: data,
          },
        })} />
      </Col>
    </Row>
  );
}
