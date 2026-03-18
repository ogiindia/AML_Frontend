import { Col } from 'react-bootstrap';
import Switch from "react-switch";
import FormToolTip from './FormToolTip';

export const SwitchInput = ({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
  tooltip,
  error,
  type,
  direction,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)

  const renderError = error ? (
    <>
      <span className="fis-danger capitalize"> {error} </span>
    </>
  ) : null;


  const triggerSwitch = (checked) => {
    const event = {
      target: {
        name,
        value: checked
      }
    };
    onChange(event);
  }



  return (
    <>
      <div className="mb-3">
        <div className={`${direction === "column" ? 'flex-direction-row' : ''}`}>
          <div className="display-flex flex-1">
            <Col className={`display-flex ${direction === "column" ? 'align-self-center' : ''}`}>
              {label && (
                <>
                  <label htmlFor={id} className="form-label flex-1">
                    {label}
                  </label>
                  <FormToolTip tooltip={tooltip} id={id} />
                </>
              )}
            </Col>
            <Col>
              <div className={`pt-1`}>
                <Switch
                  checked={value}
                  className={`react-switch`}
                  onChange={triggerSwitch}
                  // onColor={globalstate && globalstate.appPrimaryColor}
                  // onHandleColor="#2693e6"
                  handleDiameter={15}
                  // uncheckedIcon={false}
                  // checkedIcon={false}
                  // height={15}
                  // width={30}
                  id={id}
                />
              </div>
            </Col>
          </div>
          {renderError}
        </div>
      </div>
    </>
  );
};

