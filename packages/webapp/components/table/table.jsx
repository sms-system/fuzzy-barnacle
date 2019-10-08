import React from 'react'
import { cn } from '@bem-react/classname'

import './table.styl'

const cnTable = cn('Table')

export default function Table ({ className, headers = [], rows = [] }) {
  return (
    <table className={ cnTable(null, [className]) } cellSpacing="0">
      <thead>
        <tr className={ cnTable('Row') }>
          { headers.map((cell, i) =>
            <th key={ i } className={ cnTable('Cell', { head: true }) }>
              { cell }
            </th>
          ) }
        </tr>
      </thead>
      <tbody>
        { rows.map((row, i) =>
          <tr key={ i } className={ cnTable('Row', { hoverable: true }) }>
            { row.map((cell, i) =>
              <td key={ i } className={ cnTable('Cell') }>
                { cell }
              </td>
            ) }
          </tr>
        ) }
      </tbody>
    </table>
  )
}