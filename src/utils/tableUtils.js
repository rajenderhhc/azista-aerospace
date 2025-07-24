export const camelToTitle = (str) => {
  return str
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (s) => s.toUpperCase()); // capitalize the first letter
};

// export const camelToTitle = (str) => {
//   return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
// };

// export const camelToTitle = (str) => {
//   return str
//     .replace(/([A-Z])/g, " $1") // insert space before capital letters
//     .replace(/^./, (s) => s.toUpperCase()) // capitalize the first letter
//     .replace(/\n/g, "<br>"); // convert newlines to <br> for HTML
// };
