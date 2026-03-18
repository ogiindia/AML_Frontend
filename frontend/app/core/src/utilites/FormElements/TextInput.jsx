import { Col } from 'react-bootstrap';
import FormToolTip from './FormToolTip';

export const TextInput = ({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
  tooltip,
  error,
  type,
  className,
  disabled,
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

  return (
    <>
      <div className={`${direction === "column" ? 'flex-direction-row' : ''}`}>
        <Col className={`display-flex ${direction === "column" ? 'align-self-center' : ''} `}>
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
          <input
            className={`form-control form-control-md ${className}`}
            id={id}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            type={type}
            disabled={disabled || false}
          />
        </Col>
      </div>
      {renderError}
    </>
  );
};
