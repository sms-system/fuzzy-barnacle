export default function (promise) {
  let defferedReject
  const wrap = new Promise((resolve, reject) => {
    defferedReject = reject
    promise.then(res => resolve(res))
  })
  wrap.cancel = () => defferedReject('CANCEL')
  return wrap
}