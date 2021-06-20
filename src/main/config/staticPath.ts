import { resolve } from "path";

export const isDevelopment =  process.env.NODE_ENV === 'development';

const __static = isDevelopment ? '' : resolve(__dirname, '../render');

export const winURL = isDevelopment ? `http://localhost:${process.env.PORT}` : `file://${resolve(__dirname, '../render/index.html')}`;
export const loadURL = isDevelopment ? `http://localhost:${process.env.PORT}/loader.html` : `file://${resolve(__static, 'loader.html')}`;