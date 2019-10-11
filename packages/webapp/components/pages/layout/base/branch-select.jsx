import React from 'react'
import { useSelector } from 'react-redux'

import Dropdown from '../../../dropdown/dropdown'
import Menu from '../../../menu/menu'

export default function BranchSelect (props) {
  const { repo, repoList } = useSelector(({ repo, repoList }) => ({ repo, repoList }))
  return 'BRANCH SELECTOR'
  // return (
  //   <Dropdown {...props} currentItemText={ repo }>
  //     { props => <Menu {...props}>
  //       { repoList.map(repo => props =>
  //         <a {...props} href="#" key={ repo }>{ repo }</a>
  //       ) }
  //     </Menu> }
  //   </Dropdown>
  // )
}