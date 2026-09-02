const HTTP_TOKEN_CHARACTER_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]$/;

/**
 * Content-Type 값이 RFC 토큰·인용 문자열 규칙을 지킨 `application/json`인지 검사합니다.
 * 매개변수는 허용하지만 `+json` 하위 타입이나 잘못된 구문은 허용하지 않습니다.
 */
export function isJsonMediaType(value: string | null): boolean {
  if (value === null) {
    return false;
  }

  let index = skipOptionalWhitespace(value, 0);
  const typeStart = index;
  index = readTokenEnd(value, index);
  const type = value.slice(typeStart, index);
  if (value[index] !== "/") {
    return false;
  }

  index += 1;
  const subtypeStart = index;
  index = readTokenEnd(value, index);
  const subtype = value.slice(subtypeStart, index);
  if (
    type.toLowerCase() !== "application" ||
    subtype.toLowerCase() !== "json"
  ) {
    return false;
  }

  index = skipOptionalWhitespace(value, index);
  while (index < value.length) {
    if (value[index] !== ";") {
      return false;
    }
    index = skipOptionalWhitespace(value, index + 1);

    const parameterNameStart = index;
    index = readTokenEnd(value, index);
    if (index === parameterNameStart || value[index] !== "=") {
      return false;
    }

    index += 1;
    if (value[index] === '"') {
      index = readQuotedStringEnd(value, index);
      if (index === -1) {
        return false;
      }
    } else {
      const parameterValueStart = index;
      index = readTokenEnd(value, index);
      if (index === parameterValueStart) {
        return false;
      }
    }
    index = skipOptionalWhitespace(value, index);
  }

  return true;
}

function readTokenEnd(value: string, start: number): number {
  let index = start;
  while (
    index < value.length &&
    HTTP_TOKEN_CHARACTER_PATTERN.test(value[index])
  ) {
    index += 1;
  }
  return index;
}

function readQuotedStringEnd(value: string, start: number): number {
  let index = start + 1;
  while (index < value.length) {
    if (value[index] === '"') {
      return index + 1;
    }
    if (value[index] === "\\") {
      index += 1;
      if (
        index >= value.length ||
        !isQuotedPairCharacter(value.charCodeAt(index))
      ) {
        return -1;
      }
    } else if (!isQuotedTextCharacter(value.charCodeAt(index))) {
      return -1;
    }
    index += 1;
  }
  return -1;
}

function skipOptionalWhitespace(value: string, start: number): number {
  let index = start;
  while (value[index] === " " || value[index] === "\t") {
    index += 1;
  }
  return index;
}

function isQuotedTextCharacter(code: number): boolean {
  return (
    code === 0x09 ||
    code === 0x20 ||
    code === 0x21 ||
    (code >= 0x23 && code <= 0x5b) ||
    (code >= 0x5d && code <= 0x7e) ||
    (code >= 0x80 && code <= 0xff)
  );
}

function isQuotedPairCharacter(code: number): boolean {
  return (
    code === 0x09 ||
    (code >= 0x20 && code <= 0x7e) ||
    (code >= 0x80 && code <= 0xff)
  );
}
