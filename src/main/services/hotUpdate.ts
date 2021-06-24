import { app, BrowserWindow } from 'electron';
import { arch } from 'os';
import { emptyDir, createWriteStream, readFile, copy } from 'fs-extra';
import { join, resolve } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import axios from 'axios';
import { createHmac } from 'crypto';
import extract from 'extract-zip';
import { load} from 'js-yaml';
import { gte } from 'semver';
import { version } from '../../../package.json';
import { hotUpdate } from '../../../config/config.json';
import { HOT_UPDATE_STATUS, HOT_UPDATE_SIGNAL } from '@publicEnum/update'
import { BaseServices } from './baseServices';

const request = axios.create();
const appPath = app.getAppPath();
const updatePath = resolve(appPath, '../../update');
const streamPipline = promisify(pipeline);

const hotUpdateConfig = {
    url: `${hotUpdate.downloadUrl}/${arch()}/`,
    configName: hotUpdate.configFileName,
}

type LatestInfo = {
    version: string
    files: {
        url: string
        sha512: string
        size: number
    }
}

const downloadFIle = async (url:string, savePath: string) => {
    const res = await request({ url, responseType: "stream" });
    await streamPipline(res.data, createWriteStream(savePath));
}

const hash = (data: any, type = 'sha512', key = "c3e343ddff957cec09fd") => {
    const hmac = createHmac(type, key);
    hmac.update(data);
    return hmac.digest('hex');
}

class HotUpdate extends BaseServices<HOT_UPDATE_STATUS> {
    protected isRunHotUpdate: boolean = false;
    constructor() {
        super(HOT_UPDATE_SIGNAL.HOT_UPDATE_MSG);
    }

    async run() {
        if (this.isRunHotUpdate) {
            return;
        }
        this.isRunHotUpdate = true;
        try {
            const { data } = await request({ url: `${hotUpdateConfig.url}${hotUpdateConfig.configName}?t=${Date.now()}` });
            const latestInfo: LatestInfo = load(data) as any;
            if (gte(version, latestInfo.version)) {
                this.sendMessage(HOT_UPDATE_STATUS.HAS_NOT_NEW_VERSION);
                this.isRunHotUpdate = false;
                return;
            }
            this.sendMessage(HOT_UPDATE_STATUS.HAS_NEW_VERSION);

            this.sendMessage(HOT_UPDATE_STATUS.START_DOWNLOAD);
            const filePath = join(updatePath, latestInfo.files.url);
            await emptyDir(updatePath);
            await downloadFIle(`${hotUpdateConfig.url}${latestInfo.files.url}`, filePath);

            this.sendMessage(HOT_UPDATE_STATUS.START_MOVE_FILE);
            const buffer = await readFile(filePath);
            const sha512 = hash(buffer);
            if (sha512 !== latestInfo.files.sha512) {
                this.sendMessage(HOT_UPDATE_STATUS.VERIFY_FILE_ERROR);
                return;
            }

            this.sendMessage(HOT_UPDATE_STATUS.START_MOVE_FILE);
            const appPathTemp = join(updatePath, 'temp');
            await extract(filePath, { dir: appPathTemp });

            await emptyDir(appPath);
            copy(appPathTemp, appPath);
            this.sendMessage(HOT_UPDATE_STATUS.WAIT_RELAUNCH);

        } catch(err) {
            console.error(err);
        }
        this.isRunHotUpdate = false;
    }
}

export const hopUpdateHandle = new HotUpdate