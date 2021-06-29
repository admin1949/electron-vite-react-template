import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { MarkdownEditer } from '@render/components/MarkdownEditer';
import { FullScreenModal } from '@render/components/FullscreenModal';

export const Blogs = () => {
    const [isShowMarkdownEditer, setIsShowMarkdownEditer] = useState(false);
    return <>
        <h1>Blogs</h1>
        <Button onClick={() => setIsShowMarkdownEditer(true)}>新建</Button>
        <FullScreenModal
            onOk={() => setIsShowMarkdownEditer(false)}
            onCancel={() => setIsShowMarkdownEditer(false)}
            visible={isShowMarkdownEditer}
            title="新建文档"
            fullScreen
        >
            <MarkdownEditer></MarkdownEditer>
        </FullScreenModal>
    </>
}

