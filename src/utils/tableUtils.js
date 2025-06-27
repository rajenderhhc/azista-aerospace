export const camelToTitle = (str) => {
  return str
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (s) => s.toUpperCase()); // capitalize the first letter
};
