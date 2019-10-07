module.exports = (content, headInject, scriptInject) => {
  return '<!DOCTYPE html>' +
    content
      .replace(/<\/head>/, headInject + '</head>')
      .replace(/<\/body>\s*<\/html>$/, scriptInject + '</body></html>')
}