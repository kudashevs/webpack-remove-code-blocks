function convertNewLines(str)
{
  return str.replace(/\r?\n?/g, '\n');
}

module.exports = convertNewLines;
