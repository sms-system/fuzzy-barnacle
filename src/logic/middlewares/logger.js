module.exports = (dispatch) => (action) => {
  console.log('LOG:', action)
  let result = dispatch(action)
  return result
}