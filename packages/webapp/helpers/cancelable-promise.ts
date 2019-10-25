declare global {
  interface Promise<T> {
    cancel: (err: any) => void
  }
}

export default function (promise: Promise<any>) {
  let defferedReject: (err: any) => void
  const wrap = new Promise((resolve, reject) => {
    defferedReject = reject
    promise
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
  wrap.cancel = () => defferedReject('CANCEL')
  return wrap
}