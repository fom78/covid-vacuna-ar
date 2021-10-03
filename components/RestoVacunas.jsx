import styles from 'styles/RestoVacunas.module.css'

export default function RestoVacunas ({mostrar,onClick}) {

  const handleClick = e => {
    e.preventDefault()
    onClick(!mostrar)
  }

  return (
        <button
          onClick={handleClick}
          name='mostrar'
          value={mostrar}
          className={styles.btn}
        >{(mostrar)?'Ver top 3 Vacunas':'Ver todas las vacunas'}</button>
  )
}
