const axios = require('axios');
const AdmZip = require('adm-zip');
const { readFile, createReadStream } = require('fs-extra');
const { arch } = require('os');
const { createHmac } = require('crypto');
const path = require('path');
const FormData = require('form-data');
const { name, version } = require('../package.json');
const { hotUpdate } = require('../config/config.json');

const hash = (data, type = 'sha512', key = "c3e343ddff957cec09fd") => {
    const hmac = createHmac(type, key);
    hmac.update(data);
    return hmac.digest('hex');
}

const createZip = (filePath) => {
    const zip = new AdmZip();
    zip.addLocalFolder(filePath);
    return zip.toBuffer();
}

const request = axios.create({
    baseURL: hotUpdate.downloadUrl,
    method: 'post',
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

const createFullPkg = async () => {
    const zip = new AdmZip();

    const pkgFullName = `${name} Setup ${version}.exe`;
    createReadStream

    zip.addFile('latest.yml', await readFile(path.resolve(__dirname, '../build/latest.yml')));
    zip.addFile(pkgFullName, await readFile(path.resolve(__dirname, `../build/${pkgFullName}`)));

    return zip.toBuffer();
}

const main = async () => {
    const form = new FormData();

    const hotUpdateLocalFloder = path.resolve(__dirname, `../build/hotupdate/${arch()}`);
    const hotPkg = createZip(hotUpdateLocalFloder);
    const hotPkgHash = hash(hotPkg);

    const fullPkg = await createFullPkg();
    const fullPkgHash = hash(fullPkg);

    form.append('hotPkg', hotPkg, {
        filename: 'hotPkg.zip',
    });
    form.append('fullPkg', fullPkg, {
        filename: 'fullPkg.zip',
    });
    form.append('hotPkgHash', hotPkgHash);
    form.append('fullPkgHash', fullPkgHash);
    form.append('arch', arch());

    try {
        const { data } = await request.post('publish/myelectronapp', form, {
            headers: {
                ...form.getHeaders(),
            },
        });
        console.log(data);
    } catch (err) {
        console.log('err', err);
    }
}

main();