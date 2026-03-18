/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react';
import FormToolTip from './FormToolTip';

export const CheckBoxInput = ({
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

  const [show, setShow] = useState(true);
  const target = useRef(null);

  const renderError = error ? (
    <>
      <span className="fis-danger capitalize"> {error} </span>
    </>
  ) : null;

  return (
    <>
      <div className="mb-3">
        <div className="flex">
          <div className="form-check">
            <FormToolTip tooltip={tooltip} id={id} />
            <input
              className="form-check-input"
              id={id}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              type={type === "boolean" ? 'checkbox' : type}
              checked={value}
              {...props}
            />
            <label htmlFor={id} className="form-check-label flex-1">
              {label}
            </label>

            {renderError}
          </div>
        </div>
      </div>
    </>
  );
};

