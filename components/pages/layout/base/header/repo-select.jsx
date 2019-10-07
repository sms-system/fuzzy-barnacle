import React from 'react'
import { useSelector } from 'react-redux'

import Dropdown from '../../../../dropdown/dropdown'
import Menu from '../../../../menu/menu'

export default function RepoSelect (props) {
  const repoList = useSelector(({ repoList }) => repoList)
  return (
    <Dropdown {...props} currentItemText="Active Item">
      { props => <Menu {...props}>
        { repoList.map(repo => props =>
          <a {...props} href="#" key={ repo }>{ repo }</a>
        ) }
      </Menu> }
    </Dropdown>
  )
}