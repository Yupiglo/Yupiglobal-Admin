/** Utility Function to format and return a string in camel-case
 */
const toCamelCase = (input: string): string => {
  return input
    .split(/[_\-\s]+/) // Split by underscores, hyphens, and spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

/** Utility Function to format and return a string with the
 * first character in upper-case
 */
const toCapitalize = (input: string): string => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export { toCamelCase, toCapitalize };
