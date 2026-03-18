import { Col, Row, SimpleCard } from '@ais/components';
import { Formik } from 'formik';

function CustomForm({
  children,
  callback,
  cancel = true,
  cancelCallback,
  buttonLabel,
  title,
  subTitle,
  count,
  formValues,
  yupSchemas,
  customHeaderComponents,
}) {
  return (
    <>
      <div className="form">
        <Formik
          initialValues={{ ...formValues }}
          enableReinitialize={true}
          validationSchema={yupSchemas}
          onSubmit={(values, actions) => {
            console.warn('values', values);
            console.warn('actions', actions);
            callback(values, actions);
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Row>
                {title ? (
                  <SimpleCard
                    key={title}
                    title={title}
                    subTitle={subTitle}
                    count={count}
                    customHeaderComponents={customHeaderComponents}
                  >
                    {children && (
                      <>
                        <Col lg={6} md={6}>
                          <Row>{children({ ...props })}</Row>
                        </Col>
                      </>
                    )}
                  </SimpleCard>
                ) : (
                  <Col lg={6} md={6}>
                    <Row>{children({ ...props })}</Row>
                  </Col>
                )}
                <div className="flex-end pr-30 pt-10">
                  {cancel && (
                    <button
                      type="button"
                      onClick={cancelCallback}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-fis-secondary">
                    {buttonLabel ? buttonLabel : 'Submit'}
                  </button>
                </div>
              </Row>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default CustomForm;
