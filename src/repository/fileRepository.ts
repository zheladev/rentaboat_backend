import { IFile } from "../interfaces/file"
import { parseFile } from "../utils/fileUpload";
import * as fs from 'fs';

enum acceptedFileTypes {
    PNG = 'png',
    JPG = 'jpg',
    JPEG = 'jpeg',
    SVG = 'svg'
}

export /**
 * Returns curried helper functions to interact with the local storage
 *
 * @category Utils
 * @param {string} relativePath
 * @return {*} 
 */
const getFileRepository = (relativePath: string) => {
    return {
        save: (filename: string, base64Data: string, opts = {}) => {
            const baseDir = process.env.BASE_IMG_DIR;
            const fileName = filename;
            const file: IFile = parseFile(base64Data);
            const path = `${baseDir}${relativePath}${fileName}.${file.fileFormat}`;
            fs.writeFile(path, file.base64Data, { encoding: 'base64' }, () => { });
            return path.replace('./public', '');
        },
        fileType: (base64Data: string) => {
            return parseFile(base64Data).fileFormat;
        },
        validFileType: (base64Data: string) => {
            return Object.values<string>(acceptedFileTypes).includes(parseFile(base64Data).fileFormat);
        },
        get: (fileName: string) => {
            //get file
        }
    }
}