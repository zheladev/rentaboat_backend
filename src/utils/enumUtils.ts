/**
 * Returns enum key based on a value
 *
 * @export
 * @template T
 * @param {T} myEnum
 * @param {string} enumValue
 * @return {*}  {(keyof T|null)}
 */
export function getEnumKeyByEnumValue<T extends {[index:string]:string}>(myEnum:T, enumValue:string):keyof T|null {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
}