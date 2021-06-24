import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { MarkdownEditer } from '@render/components/MarkdownEditer';

export const Blogs = () => {
    const [isShowMarkdownEditer, setIsShowMarkdownEditer] = useState(false);
    return <>
        <h1>Blogs</h1>
        <Button onClick={() => setIsShowMarkdownEditer(true)}>新建</Button>
        <Modal
            visible={isShowMarkdownEditer}
            onOk={() => setIsShowMarkdownEditer(false)}
            onCancel={() => setIsShowMarkdownEditer(false)}
            width="calc(100vw - 200px)"
            mask={false}
            style={{ height: '100vh', left: '200px', top: 0, margin: 0 }}
            title="新建文档"
        >
            <MarkdownEditer></MarkdownEditer>
        </Modal>
    </>
}