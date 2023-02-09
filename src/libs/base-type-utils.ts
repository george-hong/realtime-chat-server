import { IUniformObject } from '../types/base.interface';

export function isString(value: unknown): boolean {
  return typeof value === 'string';
}

export function getStringByteLength(str: unknown): number {
  let result = 0;
  if (!isString(str)) return result;
  let length = (str as string).length;
  let index = 0;
  for (; index < length; index++) {
    const charCode = (str as string).charCodeAt(index);
    if (charCode <= 0x007f) {
      result += 1;
    } else if (charCode <= 0x07ff) {
      result += 2;
    } else if (charCode <= 0xffff) {
      result += 3;
    } else {
      result += 4;
    }
  }
  return result;
}

export function splitStringByByteLength(str: unknown, maxSpacePerGroup: number): Array<string> {
  const result: Array<string> = [];
  const space = maxSpacePerGroup > 3 ? Math.floor(maxSpacePerGroup) : 4;
  const targetString = (isString(str) ? str : String(str)) as string;
  let previousPosition = 0;
  let currentLength = 0;
  let index = 0;
  let length = targetString.length;
  for (; index < length; index++) {
    const isLastChar = index === length - 1;
    const charByteLength = getStringByteLength(targetString[index]);
    const isSumBiggerThanSpace = (currentLength + charByteLength) > space;
    if (isLastChar && isSumBiggerThanSpace) {
      result.push(targetString.slice(previousPosition, index));
      result.push(targetString.slice(index, index + 1));
    } else if (isLastChar) {
      result.push(targetString.slice(previousPosition, index + 1));
    } else if (isSumBiggerThanSpace) {
      result.push(targetString.slice(previousPosition, index));
      previousPosition = index;
      currentLength = charByteLength;
    } else {
      currentLength += charByteLength;
    }
  }
  return result;
}

export function replaceTemplate(template: unknown, replacements: IUniformObject<string>): string {
  let result = '';
  if (isString(template)) {
    const regExp = /{{\s*(\w+)\s*}}/g;
    result = (template as string).replace(regExp, (matched, word) => {
      return replacements[word] || '';
    })
  }
  return result
}

export const encodeQuotationMarks = (source: string, transformDouble = false): string => {
  // Take user may save escape character into consideration, we use especial character.
  const result = source.replace(/\'/g, '_&#39_');
  if (transformDouble) return result.replace(/\"/g, '_&#34_');
  return result;
};

export const decodeQuotationMarks = (source: string, transformDouble = false): string => {
  // Take user may save escape character into consideration, we use especial character.
  const result = source.replace(/_&#39_/g, '\'');
  if (transformDouble) return result.replace(/_&#34_/g, '"');
  return result;
};

