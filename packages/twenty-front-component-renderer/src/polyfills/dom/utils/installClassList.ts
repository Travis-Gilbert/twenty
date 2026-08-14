import { isDefined } from 'twenty-shared/utils';

import { type ElementWithClassAttribute } from '@/polyfills/dom/types/ElementWithClassAttribute';
import { type WorkerClassTokenList } from '@/polyfills/dom/types/WorkerClassTokenList';
import { createClassTokenList } from '@/polyfills/dom/utils/createClassTokenList';

export const installClassList = (elementPrototype: object): void => {
  const classTokenListByElement = new WeakMap<object, WorkerClassTokenList>();

  const resolveClassTokenList = (element: object): WorkerClassTokenList => {
    const existingClassTokenList = classTokenListByElement.get(element);

    if (isDefined(existingClassTokenList)) {
      return existingClassTokenList;
    }

    const createdClassTokenList = createClassTokenList(
      element as ElementWithClassAttribute,
    );
    classTokenListByElement.set(element, createdClassTokenList);

    return createdClassTokenList;
  };

  Object.defineProperty(elementPrototype, 'classList', {
    get(this: object) {
      return resolveClassTokenList(this);
    },
    set(this: object, newValue: unknown) {
      resolveClassTokenList(this).value = String(newValue);
    },
    configurable: true,
  });
};
