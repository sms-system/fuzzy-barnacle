import React, { useEffect, useState } from 'react'
import imported from 'react-imported-component'

import getFileContent from '../../../data-sources/file-content'
import cancellablePromise from '../../../helpers/cancelable-promise'

import htmlIcon from '../../../assets/file_html.svg'
import textIcon from '../../../assets/file_text.svg'

function getIcon (filename) {
  const ext = filename.split('.').pop()
  switch (ext) {
    case 'html': return htmlIcon
    case 'md': return htmlIcon
    default: return textIcon
  }
}

export default function FileContent ({ repo, branch = 'master', path }) {
  const [fileContent, setFileContent] = useState(null)

  useEffect(() => {
    if (fileContent) return
    // setLoadingState(true)

    function onData (data) {
      // setLoadingState(false)
      setFileContent(data)
    }

    const fileContentPromise = cancellablePromise(getFileContent({ repo, branch, path }))
    fileContentPromise
      .then(onData)
      .catch((err) => {
        if (err === 'CANCEL') { return }
        onData({ ERROR: err.ERROR || true })
      })

    return () => { fileContentPromise.cancel() }
  }, [ fileContent ])

  if (!fileContent) {
    return <div>LOADING</div>
  } else {
    return <pre>{ fileContent }</pre>
  }
}