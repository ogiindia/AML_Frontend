import * as React from 'react';
import { Col } from '../../components/ui/Col';
import { Row } from '../../components/ui/Row';

export function InlineBorderedCard({
  children,
  padding = true,
  gap = '2',
  margin = true,
  className = '',
}) {
  return (
    <>
      <Row
        gap={gap}
        className={`p-2 border-l-2 border border-gray-300 ${margin && 'ml-5'} rounded-lg ${className}`}
      >
        <Col padding={padding} span="full">
          {children}
        </Col>
      </Row>
    </>
  );
}
