import {
  CheckCircle,
  ExclamationCircle,
  InfoCircle,
  XCircle,
} from 'react-bootstrap-icons';

export const LabelComponent = ({ id, label, labelType }) => {
  const SuccessComponent = (label, labelType) => (
    <div
      className="alert flex-center"
      style={{
        background: 'var(--fis-success)',
      }}
    >
      <CheckCircle size={25} />
      <div className="ml-10" dangerouslySetInnerHTML={{ __html: label }}></div>
    </div>
  );

  const ErrorComponent = (label) => (
    <div
      className="alert flex-center"
      style={{
        background: 'var(--fis-danger)',
      }}
    >
      <XCircle size={25} />
      <div className="ml-10" dangerouslySetInnerHTML={{ __html: label }}></div>
    </div>
  );

  const WarningComponent = (label) => (
    <div
      className="alert flex-center"
      style={{
        background: 'var(--fis-warning)',
      }}
    >
      <ExclamationCircle size={25} />
      <div className="ml-10" dangerouslySetInnerHTML={{ __html: label }}></div>
    </div>
  );

  const InfoComponent = (label) => {
    return (
      <div
        className="alert flex-center"
        style={{
          background: 'var(--fis-info)',
        }}
      >
        <InfoCircle size={25} />
        <div
          className="ml-10"
          dangerouslySetInnerHTML={{ __html: label }}
        ></div>
      </div>
    );
  };

  const labelTypeComponent = (label, labelType) => {
    switch (labelType) {
      case 'info':
        return InfoComponent(label);
      case 'success':
        return SuccessComponent(label);
      case 'error':
        return ErrorComponent(label);
      case 'warning':
        return WarningComponent(label);
      default:
        return (
          <>
            <label dangerouslySetInnerHTML={{ __html: label }}></label>
          </>
        );
    }
  };

  return (
    <>
      <div className="mb-3">{labelTypeComponent(label, labelType)}</div>
    </>
  );
};
