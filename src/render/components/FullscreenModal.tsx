import React, { FC, useState } from 'react';
import { Modal, ModalProps, Button } from 'antd';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';

interface FullScreenProps {
    fullScreen?: boolean,
}

export const FullScreenModal: FC<ModalProps & FullScreenProps> = ({fullScreen = false, ...props} = {}) => {
    return <Modal className={fullScreen ? 'modal-wrap-fullscreen' : ''} {...props}></Modal>
}