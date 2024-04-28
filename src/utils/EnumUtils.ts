export class EnumUtils {
  static getEnumKeys(enumObj: object): string[] {
    return Object.keys(enumObj)
  }

  //assumes the keys of the enum are uppercase
  static validKey(str: string, enumObj: object): boolean {
    str = str.toUpperCase()
    return this.getEnumKeys(enumObj).includes(str)
  }

  //!doesn't infer the type of str to enumObj: only infer it to type string because of the type Record<string, ..>
  // static isValidKey(str: string, enumObj: Record<string, unknown>): str is keyof typeof enumObj {
  //   return Object.keys(enumObj).includes(str)
  // }

  // static isValidKey<T, K extends keyof T>(key: string, enumObj: { [key in K]: T }): key is K { //cannot infer because string cannot be inferred to key of T
  //   const keyString = String(key)
  //   return Object.keys(enumObj).includes(keyString)
  // }

  //infer to the string itself, not the keys of string, but validates at least: 
  //NB: method can only be used if `key` is key of T
  //use: isValidKey(str, enumObj)
  static isValidKey<T, K extends string>(key: K, enumObj: { [key in K]: T }): key is K {
    return Object.keys(enumObj).includes(key)
  }

  static getKey(enumObj, value) {
    return Object.keys(enumObj).find(key => enumObj[key] === value);
  }

  // static getEnumValue<T extends Record<string, T[string]>, TKey extends keyof T>(strKey: string, enumObj: T): T[TKey] {
  static getEnumValue<T extends object, TKey extends keyof T>(strKey: string, enumObj: T): T[TKey] {
    if (this.validKey(strKey, enumObj)) {
      strKey = strKey.toUpperCase()
      return enumObj[(strKey)]
    }
  }

  // static allKeys<EnumObj>(enum: EnumObj) {
  //   return keyof typeof enum
  // }
}
