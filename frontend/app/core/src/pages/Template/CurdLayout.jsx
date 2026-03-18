import { Heading } from '@ais/components';
import { Col, Row } from 'react-bootstrap';

function CurdLayout({ children, title, subTitle }) {
  return (
    <>
      <div className={`layout-wrapper position-relative`}>
        <Row className={`p-4 pb-none`}>
          <Col>
            <Heading title={title} subTitle={subTitle} />
          </Col>
        </Row>

        <div className={`simple-table-wrapper`}>
          <div className={``}>
            <div className={`p-4`}>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CurdLayout;
