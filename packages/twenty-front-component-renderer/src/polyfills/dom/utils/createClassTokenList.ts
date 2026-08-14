import { isFunction } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

import { type ElementWithClassAttribute } from '@/polyfills/dom/types/ElementWithClassAttribute';
import { type WorkerClassTokenList } from '@/polyfills/dom/types/WorkerClassTokenList';
import { assertValidClassTokens } from '@/polyfills/dom/utils/assertValidClassTokens';
import { parseClassTokenList } from '@/polyfills/dom/utils/parseClassTokenList';
import { resolveClassAttributeValue } from '@/polyfills/dom/utils/resolveClassAttributeValue';

export const createClassTokenList = (
  element: ElementWithClassAttribute,
): WorkerClassTokenList => {
  const readClassAttributeValue = (): string | null =>
    resolveClassAttributeValue(element);

  const readTokens = (): string[] =>
    parseClassTokenList(readClassAttributeValue() ?? '');

  const writeClassAttributeValue = (classAttributeValue: string): void => {
    if (isFunction(element.setAttribute)) {
      element.setAttribute('class', classAttributeValue);
    }
  };

  const writeTokens = (tokens: string[]): void => {
    if (!isDefined(readClassAttributeValue()) && tokens.length === 0) {
      return;
    }

    writeClassAttributeValue(tokens.join(' '));
  };

  const classTokenList: WorkerClassTokenList = {
    get length() {
      return readTokens().length;
    },
    get value() {
      return readClassAttributeValue() ?? '';
    },
    set value(newValue: string) {
      writeClassAttributeValue(String(newValue));
    },
    add: (...tokens) => {
      const stringTokens = tokens.map(String);
      assertValidClassTokens(stringTokens);

      const currentTokens = readTokens();

      for (const token of stringTokens) {
        if (!currentTokens.includes(token)) {
          currentTokens.push(token);
        }
      }

      writeTokens(currentTokens);
    },
    remove: (...tokens) => {
      const stringTokens = tokens.map(String);
      assertValidClassTokens(stringTokens);

      writeTokens(
        readTokens().filter((token) => !stringTokens.includes(token)),
      );
    },
    toggle: (token, force) => {
      const stringToken = String(token);
      assertValidClassTokens([stringToken]);

      const currentTokens = readTokens();

      if (currentTokens.includes(stringToken)) {
        if (force === true) {
          return true;
        }

        writeTokens(currentTokens.filter((value) => value !== stringToken));

        return false;
      }

      if (force === false) {
        return false;
      }

      writeTokens([...currentTokens, stringToken]);

      return true;
    },
    replace: (oldToken, newToken) => {
      const stringOldToken = String(oldToken);
      const stringNewToken = String(newToken);
      assertValidClassTokens([stringOldToken, stringNewToken]);

      const currentTokens = readTokens();

      if (!currentTokens.includes(stringOldToken)) {
        return false;
      }

      const replacementIndex = currentTokens.findIndex(
        (value) => value === stringOldToken || value === stringNewToken,
      );
      const remainingTokens = currentTokens.filter(
        (value) => value !== stringOldToken && value !== stringNewToken,
      );
      remainingTokens.splice(replacementIndex, 0, stringNewToken);

      writeTokens(remainingTokens);

      return true;
    },
    contains: (token) => readTokens().includes(String(token)),
    item: (index) => readTokens()[index] ?? null,
    supports: () => {
      throw new TypeError(
        "Failed to execute 'supports': the class attribute has no supported tokens.",
      );
    },
    forEach: (callback, thisArg) => {
      let tokenIndex = 0;

      for (const token of readTokens()) {
        callback.call(thisArg, token, tokenIndex, classTokenList);
        tokenIndex += 1;
      }
    },
    *entries() {
      yield* readTokens().entries();
    },
    *keys() {
      yield* readTokens().keys();
    },
    *values() {
      yield* readTokens().values();
    },
    toString: () => readClassAttributeValue() ?? '',
    *[Symbol.iterator]() {
      yield* readTokens().values();
    },
  };

  return classTokenList;
};
