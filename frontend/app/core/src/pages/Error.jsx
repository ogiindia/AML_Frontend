import { PlainLayout, Row, SimpleCard } from '@ais/components';

function Error() {
  return (
    <>
      <PlainLayout>
        <Row justify="center">
          <SimpleCard>
            Your dont have permission,Please contact the application
            administrator
          </SimpleCard>
        </Row>
      </PlainLayout>
    </>
  );
}

export default Error;
