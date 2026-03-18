import * as React from 'react';
import { Col } from '../../components/ui/Col';
import { Row } from '../../components/ui/Row';
import { Icons } from '../Utilities';
import { ButtonProps } from './ButtonProps';

export function IconButton({ icon, onClick, className = '' }: ButtonProps) {
  return (
    <Row>
      <Col span="auto">
        <div onClick={onClick} className={`cursor-pointer`}>
          <Icons name={icon} size={20} className={className} />
        </div>
      </Col>
    </Row>
  );
}
