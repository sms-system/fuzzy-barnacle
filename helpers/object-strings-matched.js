export default (obj1, obj2) => {
  return Object.keys(obj2).every((key) => obj1[key] === obj2[key])
}