import { IFile } from "../interfaces/file"

export const fileRepository = (relativePath: string) => {
    return {
        save: (file: IFile, opts) => { 
            //save file
            //can access relativePath
        },
        get: (fileName: string) => {
            //get file
            //can access relativePath
        }
    }
}