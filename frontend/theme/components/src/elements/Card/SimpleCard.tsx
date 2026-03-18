import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Col } from '../../components/ui/Col';
import { Row } from '../../components/ui/Row';
import { textalignMap } from '../Map';

interface SimpleCardProps {
  children?: React.ReactNode;
  title?: string;
  desc?: string;
  subtitle?: string;
  align?: string;
  padding?: boolean;
  className?: string;
  justify?: string;
  customHeaderComponents?: React.ReactNode;
}

export function SimpleCard({
  children,
  title,
  desc,
  align = 'center',
  justify = 'between',
  padding = true,
  subtitle,
  className = '',
  customHeaderComponents
}: SimpleCardProps) {
  return (
    <Card padding={padding} className={className}>
      {(title || (desc || subtitle)) && (
        <CardHeader className={`${textalignMap[align]}`}>
          <Row gap={'0'} align={align} justify={justify}>
            <Col span={'auto'} gap={0}>
              {title && <CardTitle className="text-xl">{title}</CardTitle>}
              {(desc || subtitle) && <CardDescription>{desc || subtitle}</CardDescription>}
            </Col>
            {customHeaderComponents && (<Col span={'auto'}> {customHeaderComponents}</Col>)}
          </Row>
        </CardHeader>
      )}
      <CardContent padding={padding}>{children}</CardContent>
    </Card>
  );
}

export default SimpleCard;
