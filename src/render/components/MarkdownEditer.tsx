import React, { useEffect, useRef, useState } from "react";
import { fromTextArea } from 'codemirror';

import Markdown from 'react-markdown';
import style from './MarkdownEditor.module.less';
import gfm from 'remark-gfm';


export const MarkdownEditer = () => {
    const [input, setInput] = useState('');
    const textarea = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!textarea.current) {
            return () => {};
        }
        const editor = fromTextArea(textarea.current, {
            lineNumbers: true,
            theme: 'nord',
            tabSize: 4,
            lineWrapping: true,
        });
        editor.on('change', (cm) => {
            setInput(cm.getValue());
        });
        return () => {
            editor.toTextArea();
            console.log('destory the editor');
        }
    }, []);

    return <div className={style.content}>
        <div className={style.editor}>
            <textarea ref={textarea}></textarea>
        </div>
        <div className={style.result}>
            <Markdown  plugins={[gfm]} children={input}></Markdown>
        </div>
    </div>
}