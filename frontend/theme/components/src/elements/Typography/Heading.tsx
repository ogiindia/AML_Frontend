/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

export function H3({ children }: any) {
  return <h3 className="font-semibold mb-2">{children}</h3>;
}

export function H1({ children }: any) {
  return <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}  >{children}</h1>;
}

export function Heading({
  children,
  title,
  subHeading,
  subTitle,
  center = false,
  className = '',
}: React.ComponentProps<'div'>) {
  const [defaultTitle, setdefaultTitle] = useState(document.title);

  useEffect(() => {
    document.title = title?.trim() ? title : defaultTitle;

    return () => {
      document.title = defaultTitle;
    };
  }, [title, defaultTitle]);

  return (
    <>
      <div
        className={`flex flex-col gap-2 ${center && 'text-center items-center'} ${className}`}
      >
        <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }} >{title}</h1>
        {(subHeading || subTitle) && (
          <p className="text-muted-foreground text-sm text-balance">
            {subTitle || subHeading}
          </p>
        )}
      </div>
      {children}

      {/* <Row>
        <Col>
          <div className="pg-heading pt-1">
            <Row>
              <Col>
                <h3>{title}</h3>
              </Col>
            </Row>
          </div>
          <Row>
            {(subHeading || subTitle) && (
              <>
                <Col>
                  <div className="pg-sub-heading">
                    <h6>{subHeading || subTitle}</h6>
                  </div>
                </Col>
              </>
            )}
          </Row>
        </Col>
        {children && <Col>{children}</Col>}
      </Row> */}
    </>
  );
}
