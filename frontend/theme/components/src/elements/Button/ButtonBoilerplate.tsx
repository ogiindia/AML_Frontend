import * as React from 'react';
import { Button } from '../../components/ui/button';
import { Col } from '../../components/ui/Col';
import { Row } from '../../components/ui/Row';
import { InlineLoadingComponent } from '../../InlineLoadingComponent';
import { IconName, Icons } from '../Utilities/Icons';

interface ButtonBoilerPlateProps {
  label?: string;
  loading?: boolean;
  onClick?: (e) => void;
  type: string;
  className?: string;
  icon?: IconName;
  variant?: string;
  children?: React.ReactNode;
}

export function ButtonBoilerplate({
  loading,
  label,
  onClick,
  className,
  type = 'submit',
  icon,
  variant = 'default',
  children,
  ...props
}: ButtonBoilerPlateProps & React.ComponentProps<'div'>) {
  const onClickCallBack = (e) => {
    if (loading) return;
    if (onClick) {
      console.log('loading : ' + loading);
      onClick(e);
    }
  };

  return (
    <Button
      type={type}
      className={`${loading || 'cursor-pointer'}  ${className}`}
      onClick={onClickCallBack}
      variant={variant}
      {...props}
    >
      <div className={`flex flex-wrap items-center`}>
        <Row gap="0" nowrap align="center" justify={'between'}>
          {icon && !loading && (
            <Col span="3" className={`pr-2`} padding={false}>
              <Icons name={icon} />
            </Col>
          )}

          {loading && (
            <Col span="3" className={`pr-2`} padding={false}>
              <InlineLoadingComponent />
            </Col>
          )}

          <Col span="auto" padding={false}>
            <span className={`text-base`}>{label || children}</span>
          </Col>
        </Row>
      </div>
    </Button>
  );
}
