import { useRef, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Question } from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';

// const validations = {
//   image: 'image/*',
//   csv: 'csv',
//   txt: 'txt',
//   doc: 'csv,docx,txt',
// };

const UploadComponent = (props) => {
  const { setFieldValue } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('files', acceptedFiles);
    },
  });
  return (
    <div>
      { }
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
};

const FileUpload = ({
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
      <div className="">
        <div className="flex">
          {label && (
            <>
              <label htmlFor={id} className="form-label flex-1">
                {label}
              </label>

              {tooltip && (
                <>
                  <span className={`form-control-tooltip`}>
                    <OverlayTrigger
                      key={id}
                      overlay={
                        <tooltip key={id} id="tooltip-top">
                          {tooltip}
                        </tooltip>
                      }
                    >
                      <span className="d-inline-block">
                        <Question
                          className="ml-4 fis-primary"
                          size={20}
                          onClick={() => setShow(!show)}
                          ref={target}
                        />
                      </span>
                    </OverlayTrigger>
                  </span>
                </>
              )}
            </>
          )}
        </div>
        <UploadComponent setFieldValue={onChange} />
        {renderError}
      </div>
    </>
  );
};
export default FileUpload;
