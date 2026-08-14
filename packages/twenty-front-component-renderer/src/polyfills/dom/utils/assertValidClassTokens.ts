import { isNonEmptyString } from '@sniptt/guards';

const ASCII_WHITESPACE_CHARACTER = /[\t\n\f\r ]/;

export const assertValidClassTokens = (tokens: string[]): void => {
  for (const token of tokens) {
    if (!isNonEmptyString(token)) {
      throw new DOMException(
        'The token provided must not be empty.',
        'SyntaxError',
      );
    }

    if (ASCII_WHITESPACE_CHARACTER.test(token)) {
      throw new DOMException(
        `The token provided ('${token}') contains HTML space characters, which are not valid in tokens.`,
        'InvalidCharacterError',
      );
    }
  }
};
