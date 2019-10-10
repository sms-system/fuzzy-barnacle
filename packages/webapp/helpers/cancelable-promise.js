export default function (promise) {
  let defferedReject
  const wrap = new Promise((resolve, reject) => {
    defferedReject = reject
    promise
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
  wrap.cancel = () => defferedReject('CANCEL')
  return wrap
}