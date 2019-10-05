import React, { useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'

const HelloWorld = ({ name, foo }) => {
  const data = useSelector(({ data }) => data)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch('https://swapi.co/api/people/')
      let data = await response.json()

      dispatch({
        type: 'SET_DATA',
        payload: data.results
      })
    }
    if (!data) { fetchData() }
  }, [ JSON.stringify(data) ])

  return (
    <div>
      <div>{ foo } - { name } - { JSON.stringify(data) }</div>
    </div>
  )
}

export default connect(
  ({ name }) => ({ foo: name })
)(HelloWorld)