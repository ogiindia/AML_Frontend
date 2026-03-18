import { BrowserRouter as Router } from 'react-router-dom';
import { CONTEXT_PATH } from '../config';
import { ModelHostProvider } from '../utilites/Contexts/ModalHostContext';
import DynamicNavigations from './DynamicNavigations';
import UamNavigations from './SubNavigations';

function Navigations() {
  return (
    <>
      <Router basename={CONTEXT_PATH}>
        <ModelHostProvider>
          <UamNavigations />
          <DynamicNavigations />
        </ModelHostProvider>
      </Router>
    </>
  );
}

export default Navigations;
