module.exports = (e) => {
  const date = e;
  const year = date.getFullYear();
  const yearLength = year.toString().length;
  if (yearLength > 4) {
    return false;
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};
