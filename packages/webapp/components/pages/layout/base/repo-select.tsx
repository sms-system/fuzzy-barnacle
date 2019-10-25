import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'wouter'

import Dropdown from '../../../dropdown/dropdown'
import Menu from '../../../menu/menu'

export default function RepoSelect (props: { [key: string]: any }) {
  const { repo, repoList } = useSelector(({ repo, repoList }: { repo: string, repoList: string[] | any }) => ({ repo, repoList }))
  return (repo && repoList && repoList.length && !repoList.ERROR) ? (
    <Dropdown {...props} currentItemText={ repo }>
      { (props: any) => <Menu {...props}>
        { repoList.map((repo: string) => (props: any) =>
          <Link {...props} href={`/repos/${repo}`} key={ repo }>{ repo }</Link>
        ) }
      </Menu> }
    </Dropdown>
  ) : <></>
}