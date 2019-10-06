import React, { useEffect } from 'react'

import Dropdown from '../../../../dropdown/dropdown'
import Menu from '../../../../menu/menu'

export default function RepoSelect (props) {
  return (
    <Dropdown {...props} currentItemText="Active Item">
      { props => <Menu>
        MENU
      </Menu> }
    </Dropdown>
  )
}