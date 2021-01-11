import { IFile } from "../interfaces/file";

export const parseFile = (base64Data: string): IFile => {
    return {
        fileFormat: base64Data.substring("data:image/".length, base64Data.indexOf(";base64")),
        base64Data: base64Data.replace(/^data:image\/([a-z]*);base64,/, "")
    }
}