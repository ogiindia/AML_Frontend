import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { Col } from './components/ui/Col';
import { Row } from './components/ui/Row';

export function LoadingComponent({
  text = 'Loading',
}: React.ComponentProps<'div'>) {
  return (
    <div className="loading-component display-flex">
      <Row gap="1">
        <Col span="auto">
          <Loader2 className={`size-5 animate-spin`} />
        </Col>
        <Col span="auto">
          <h4 className="text-md">
            <span>{text}</span>
          </h4>
        </Col>
      </Row>

      {/* <div className={`flex-end`}>
        <div className="loader"></div>
        <h4 className="text align-self-flex-bottom">
          <span>{text}</span>
        </h4>
      </div> */}
    </div>
  );
}
