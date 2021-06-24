const { emptyDir, readFile, stat, writeFile } = require('fs-extra');
const path = require('path');
const AdmZip = require('adm-zip');
const { createHmac } = require('crypto');
const { version, build } = require('../package.json');
const { dump } = require('js-yaml');
const { arch } = require('os');
const { hotUpdate } = require('../config/config.json');

const hash = (data, type = 'sha512', key = "c3e343ddff957cec09fd") => {
    const hmac = createHmac(type, key);
    hmac.update(data);
    return hmac.digest('hex');
}

const createZip = (filePath, dest) => {
    const zip = new AdmZip();
    zip.addLocalFolder(filePath);
    zip.toBuffer();
    zip.writeZip(dest);
}

const main = async () => {
    if (build.asar) {
        console.log('hot update need build.asar option in the package.json file is set to false');
        return;
    }
    try {
        const appPath = path.resolve(__dirname, '../build/win-unpacked/resources/app');
        const name = `app${version}.hotupdate.zip`;
        const outPutPath = path.resolve(__dirname, `../build/hotupdate/${arch()}`);
        const zipPath = path.join(outPutPath, name);
        await emptyDir(outPutPath);
    
        createZip(appPath, zipPath);
        const buffer = await readFile(zipPath);
        const sha512 = hash(buffer);
        const file = await stat(zipPath);
    
        const yml = dump({
            version,
            files: {
                url: name,
                sha512: sha512,
                size: file.size,
            }
        });
        await writeFile(path.join(outPutPath, hotUpdate.configFileName), yml);

    }catch (err) {
        console.log(err);
    }
}

main();