import { Modal } from 'antd';

class ModalStore {
    info(config) {
        Modal.info(config);
    }

    success(config) {
        Modal.success(config);
    }

    warning(config) {
        Modal.warning(config);
    }

    error(config) {
        Modal.error(config);
    }
}

const modalStore = new ModalStore();
export default modalStore;
