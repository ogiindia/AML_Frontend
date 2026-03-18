import { RefreshCw } from 'lucide-react';
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
import { ButtonBoilerplate } from '../Button/ButtonBoilerplate';
import { textalignMap } from '../Map';
import { Divider } from '../Typography';
import { PaginationControlled } from '../Utilities';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
];

interface TableCardProps {
  title?: string;
  subtitle?: string;
  count?: number;
  className?: string;
  customHeaderComponents?: React.ReactNode;
  table?: boolean;
  totalElements?: number;
  pageSize?: number;
  currentElement?: number;
  pagingCallback?: (e) => void;
  showPaging?: boolean;
  filterCallback?: () => void;
  refreshCallBack?: () => void;
  children?: React.ReactNode;
}

export function TableCard({
  title,
  subtitle,
  count = 0,
  className,
  customHeaderComponents,
  table = true,
  totalElements = 0,
  pageSize = 10,
  currentElement = 1,
  showPaging = true,
  pagingCallback,
  filterCallback,
  refreshCallBack,
  children,
}: TableCardProps) {
  return (
    <>
      <Card padding={false} className={`${title && 'pt-6'}`}>
        {(title || totalElements > 10) && (
          <CardHeader padding={false} className={textalignMap['left']}>
            <Row gap="1" align="center" justify="between">
              <Col span="auto">
                {title && (
                  <CardTitle className="text-xl">
                    {count ? (
                      <>
                        {title}
                        <span className={`text-sm`}>&nbsp; ( {count} )</span>
                      </>
                    ) : (
                      { title }
                    )}
                  </CardTitle>
                )}
                {subtitle && <CardDescription>{subtitle}</CardDescription>}
              </Col>

              <Col span="auto">
                <Row gap="2" align="center" justify="end">
                  {refreshCallBack && (
                    <Col span="auto">
                      <ButtonBoilerplate
                        type="button"
                        variant="link"
                        label={<RefreshCw size={20} />}
                        onClick={refreshCallBack}
                      />
                    </Col>
                  )}

                  {customHeaderComponents}

                  {showPaging && totalElements > pageSize && (
                    <Col span="auto">
                      <PaginationControlled
                        page={currentElement}
                        totalPages={Math.ceil(totalElements / pageSize)}
                        onPageChange={(newPage) => {
                          console.log("Selected page:", newPage);
                          pagingCallback?.(newPage);
                        }}
                      />
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </CardHeader>
        )}

        <CardContent padding={false}>
          <Divider orientation="horizontal" />
          {children}
        </CardContent>
      </Card >
    </>
  );
}
