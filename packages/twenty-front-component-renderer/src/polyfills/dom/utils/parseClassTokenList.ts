import { isNonEmptyString } from '@sniptt/guards';

const ASCII_WHITESPACE_SEPARATOR = /[\t\n\f\r ]+/;

export const parseClassTokenList = (classAttributeValue: string): string[] => {
  const orderedUniqueTokens: string[] = [];

  for (const token of classAttributeValue.split(ASCII_WHITESPACE_SEPARATOR)) {
    if (isNonEmptyString(token) && !orderedUniqueTokens.includes(token)) {
      orderedUniqueTokens.push(token);
    }
  }

  return orderedUniqueTokens;
};
