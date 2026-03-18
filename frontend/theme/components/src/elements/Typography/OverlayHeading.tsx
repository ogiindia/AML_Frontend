import * as React from 'react';
import { Col, Row } from 'react-bootstrap';

export function OverlayHeading({
  children,
  title,
  subHeading,
  subTitle,
}: React.ComponentProps<'div'>) {
  return (
    <>
      <div className="pg-heading pt-1 bg-overlay">
        <div className={`heading-wrapper`}>
          <div className={`p-4`}>
            <Row>
              <Col>
                <h3>{title}</h3>
              </Col>
            </Row>
            <Row>
              {(subHeading || subTitle) && (
                <Col>
                  <div className="pg-sub-heading">
                    <h6>{subHeading || subTitle}</h6>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
