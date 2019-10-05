module.exports = (content, hydrateMarksScript) => {
  return '<!DOCTYPE html>' +
    content.replace(/<\/body>\s*<\/html>$/, hydrateMarksScript + '</body></html>')
}