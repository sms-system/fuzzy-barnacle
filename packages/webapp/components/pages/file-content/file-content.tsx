import React, { useEffect, useState } from 'react'
import imported from 'react-imported-component'

import getFileContent from '../../../data-sources/file-content'
import cancellablePromise from '../../../helpers/cancelable-promise'

//@ts-ignore
import htmlIcon from '../../../assets/file_html.svg'
//@ts-ignore
import textIcon from '../../../assets/file_text.svg'

function getIcon (filename: string) {
  const ext = filename.split('.').pop()
  switch (ext) {
    case 'html': return htmlIcon
    case 'md': return htmlIcon
    default: return textIcon
  }
}

interface props {
  repo: string,
  branch: string,
  path: string
}

export default function FileContent (props: props) {
  const { repo, branch = 'master', path } = props
  const [fileContent, setFileContent] = useState(null)

  useEffect(() => {
    if (fileContent) return
    // setLoadingState(true)

    function onData (data: React.SetStateAction<null>) {
      // setLoadingState(false)
      setFileContent(data)
    }

    const fileContentPromise = cancellablePromise(getFileContent({ repo, branch, path }))
    fileContentPromise
       //@ts-ignore
      .then(onData)
      .catch((err: any) => {
        if (err === 'CANCEL') { return }
        //@ts-ignore
        onData({ ERROR: err.ERROR || true })
      })

    //@ts-ignore
    return () => { fileContentPromise.cancel() }
  }, [ fileContent ])

  if (!fileContent) {
    return <div>LOADING</div>
  } else {
    return <pre>{ fileContent }</pre>
  }
}