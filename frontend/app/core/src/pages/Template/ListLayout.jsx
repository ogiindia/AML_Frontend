import { OverlayHeading } from '@ais/components';
import { Col, Row } from 'react-bootstrap';

function ListLayout({ children, title, subTitle }) {
  return (
    <>
      <div className={`layout-wrapper position-relative`}>
        <Row className={``}>
          <Col>
            <OverlayHeading title={title} subTitle={subTitle} />
          </Col>
        </Row>

        <div className={`simple-table-wrapper`}>
          <div className={`overlay-table`}>
            <div className={`p-4`}>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListLayout;
