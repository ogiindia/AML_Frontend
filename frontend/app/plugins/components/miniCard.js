import React from 'react';
import Col from 'Col';
import Card from 'Card';

function MiniCard({ title, children, className }) {
  return (
    <Col sm={3} md={3} lg={3}>
      <div className="p-1">
        <Card>
          <div className="p-2 border-bottom-fis-info-2">
            <p className="mini-card-heading uppercase">{title}</p>
            <div className={`h1 ${className}`}>{children}</div>
          </div>
        </Card>
      </div>
    </Col>
  );
}

export default MiniCard;
