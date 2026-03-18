import { Button } from 'react-bootstrap';
import { ArrowLeftShort } from 'react-bootstrap-icons';
function BackButton({ callback, label }) {
  return (
    <>
      <div className="back-button">
        <Button
          variant="link"
          className="btn btn-outline fis-secondary text-decoration-none"
          onClick={callback}
        >
          <ArrowLeftShort className="fis-secondary" size={20} />

          {label}
        </Button>
      </div>
    </>
  );
}

export default BackButton;
