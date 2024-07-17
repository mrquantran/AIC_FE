/**
 * Flat array of nested object with `children` prop
 * @param array Nested object array with `children` prop
 * @returns Flatted array
 */
export const flatten = <T extends { children?: T[] }>(array: T[] = []): T[] =>
  array.reduce<T[]>((prev, curr) => {
    if (curr.children) {
      return [...prev, curr, ...flatten(curr.children)];
    }

    return [...prev, curr];
  }, []);
