export type ElementWithClassAttribute = {
  getAttribute?: (attributeName: string) => string | null;
  setAttribute?: (attributeName: string, attributeValue: string) => void;
  className?: unknown;
};
