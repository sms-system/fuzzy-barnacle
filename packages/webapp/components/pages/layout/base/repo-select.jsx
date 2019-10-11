import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'wouter'

import Dropdown from '../../../dropdown/dropdown'
import Menu from '../../../menu/menu'

export default function RepoSelect (props) {
  const { repo, repoList } = useSelector(({ repo, repoList }) => ({ repo, repoList }))
  return (repo && repoList && repoList.length && !repoList.ERROR) ? (
    <Dropdown {...props} currentItemText={ repo }>
      { props => <Menu {...props}>
        { repoList.map(repo => props =>
          <Link {...props} href={`/repos/${repo}`} key={ repo }>{ repo }</Link>
        ) }
      </Menu> }
    </Dropdown>
  ) : <></>
}