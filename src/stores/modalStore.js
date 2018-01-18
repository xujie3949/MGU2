import { Modal } from 'antd';

class ModalStore {
    info(message) {
        Modal.info(
            {
                title: '信息',
                content: message,
            },
        );
    }

    success(message) {
        Modal.success(
            {
                title: '成功',
                content: message,
            },
        );
    }

    warning(message) {
        Modal.warning(
            {
                title: '警告',
                content: message,
            },
        );
    }

    error(message) {
        Modal.error(
            {
                title: '错误',
                content: message,
            },
        );
    }
}

const modalStore = new ModalStore();
export default modalStore;
