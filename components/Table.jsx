/* eslint-disable react/jsx-key */
import { useCallback, useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import { toDigit } from './NumberDigits.jsx'
import { toPercentage } from './NumberPercentage.jsx'
import styles from 'styles/Table.module.css'

export default function Table ({ data, filter, setFilter }) {
  const locale = 'es'

  const handleRowClick = useCallback(
    ({ original: { jurisdiccionNombre } }) => () => {
      setFilter(jurisdiccionNombre === filter ? 'Totales' : jurisdiccionNombre)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [filter, setFilter]
  )

  const formatDigit = number => toDigit({ locale, number })
  const formatPercentage = number => toPercentage({ locale, number })

  const tableData = useMemo(
    () => data.map(row => {
      const {
        // porcentajeEntregadas,
        // porcentajePoblacionAdministradas,
        // porcentajePoblacionCompletas,
        porcentajePrimeraDosis,
        porcentajeSegundaDosis,
        primeraDosisCantidad,
        ...rest
      } = row
      console.log(primeraDosisCantidad)
      const porcentajePoblacionVacunada = primeraDosisCantidad / 45376763
      return {
        // porcentajeEntregadas: porcentajeEntregadas.toFixed(4),
        // porcentajePoblacionAdministradas: porcentajePoblacionAdministradas.toFixed(4),
        // porcentajePoblacionCompletas: porcentajePoblacionCompletas.toFixed(4),
        porcentajePrimeraDosis: porcentajePrimeraDosis.toFixed(4),
        porcentajeSegundaDosis: porcentajeSegundaDosis.toFixed(4),
        porcentajePoblacionVacunada: porcentajePoblacionVacunada.toFixed(4),
        ...rest
      }
    }), []
  )

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'jurisdiccionNombre',
        format: (jurisdiccionNombre) => jurisdiccionNombre
      },
      // {
      //   Header: 'Dosis distribuidas',
      //   accessor: 'dosisEntregadas',
      //   format: formatDigit
      // },
      {
        Header: 'Primera Dosis',
        accessor: 'primeraDosisCantidad',
        format: formatDigit
      },
      {
        Header: '% sobre distribuidas',
        accessor: 'porcentajePrimeraDosis',
        format: formatPercentage
      },
      {
        Header: '% población vacunada',
        accessor: 'porcentajePoblacionVacunada',
        format: formatPercentage
      },
      {
        Header: 'Segunda Dosis',
        accessor: 'segundaDosisCantidad',
        format: formatDigit
      },
      {
        Header: '% población totalmente vacunada',
        accessor: 'porcentajeSegundaDosis',
        format: formatPercentage
      }
    ],
    []
  )

  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data: tableData }, useSortBy)

  // totales siempre en la ultima fila
  rows = [...rows.filter(row => row.id !== '24'), rows.find(row => row.id === '24')]

  return (
    <div className={styles.container}>
      <table className={styles.table} {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                          ? ' ▼'
                          : ' ▲'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row)
            const className = row.id === '24' ? styles.totales : row.original.jurisdiccionNombre === filter ? styles.selected : ''
            return (
              <tr {...row.getRowProps()} className={className} onClick={handleRowClick(row)}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.column.format(cell.value)}
                    </td>
                  )
                })}
                <td className={styles.mobileData}>
                  {row.cells.map((cell, index) => {
                    return (
                      <span>
                        {index === 0 ? '' : `${headerGroups[0].headers[index].Header} - ${cell.column.format(cell.value)}`}
                      </span>
                    )
                  })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
