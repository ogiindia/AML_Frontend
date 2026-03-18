import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { CaretDownFill, CaretRightFill } from 'react-bootstrap-icons';
import { Divider } from './Divider';

export function CollapsibleText({
  title,
  subTitle,
  isCollapsed,
  collapsible = true,
  children,
  count,
}: any) {
  const [isOpened, SetOpened] = useState(true);

  useEffect(() => {
    SetOpened(!isCollapsed);
  }, [isCollapsed]);

  return (
    <>
      <div className="p-10">
        <Row>
          <Col>
            <div
              onClick={() => collapsible && SetOpened(!isOpened)}
              className={`${collapsible ? 'flex-center pr-10 cursor-pointer' : ''}`}
            >
              <>
                {collapsible ? (
                  !isOpened ? (
                    <CaretRightFill className={``} size={12} />
                  ) : (
                    <CaretDownFill className={``} size={12} />
                  )
                ) : (
                  <></>
                )}
              </>

              <div className="flex-direction-row flex-1">
                <span className="heading">
                  {title}{' '}
                  {count && (
                    <>
                      <span className={`font-count`}>( {count} )</span>
                    </>
                  )}
                </span>
                <span className="">{subTitle}</span>
              </div>
            </div>

            {isOpened && children && (
              <div className="pl-10">
                <div className="">{children}</div>
              </div>
            )}
          </Col>
        </Row>
        <Divider className={`pd-10`} />
      </div>
    </>
  );
}
