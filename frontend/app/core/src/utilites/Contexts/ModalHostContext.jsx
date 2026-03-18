import { SimpleModal } from '@ais/components';
import { createContext, useCallback, useContext, useState } from 'react';
import { fetchComponent } from '../../api/RemoteComponentAPI';

const ModalHostContext = createContext({
  showPluginModal: async () => { },
  closeModal: () => { },
});

export function ModelHostProvider({ children }) {
  const [ModalComponent, setModalComponent] = useState(null);
  const [modalProps, setmodalProps] = useState({});

  const [show, setshow] = useState(false);

  const closeModal = useCallback(() => {
    setModalComponent(null);
    setmodalProps({});
  }, []);

  const showPluginModal = useCallback(async (__id, props = {}) => {
    try {
      const pluginModal = await fetchComponent(__id);
      setModalComponent(() => pluginModal.default || pluginModal);
      setmodalProps(props);
    } catch (err) {
      console.error('Failed to load modal ', err);
    }
  }, []);

  return (
    <ModalHostContext.Provider value={{ showPluginModal, closeModal }}>
      {children}
      {ModalComponent && (
        <SimpleModal isOpen={true} size={`${modalProps['size'] ? modalProps['size'] : 'sm'}`} handleClose={closeModal}>
          <ModalComponent {...modalProps} closeModal={closeModal} />
        </SimpleModal>
      )}
    </ModalHostContext.Provider>
  );
}

export const useModalHost = () => {
  return useContext(ModalHostContext);
}
