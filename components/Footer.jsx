import styles from 'styles/Footer.module.css'

export default function Footer () {
  return (
    <footer className={styles.footer}>
      
      
      <div>
      <a href="https://github.com/midudev/covid-vacuna" target="_blank" rel="nofollow noopener noreferrer">
                    Forkeado y adaptado de covid-vacuna{' '}
            </a>
            <span>&bull;</span>
        <a
          href='https://twitter.com/fom78a'
          target='_blank'
          rel='noreferrer'
        >
          Adaptado por fom78{' '}
          {/* <img width='92' height='24' loading='lazy' src='https://midu.dev/logo.png' alt='midudev' /> */}
        </a>
        <span>&bull;</span>
        <a href='https://github.com/fom78' rel='nofollow noreferrer' target='_blank'>GitHub</a>
        <span>&bull;</span>
        <a href='https://github.com/fom78/covid-vacuna-ar/issues/new' rel='nofollow noreferrer' target='_blank'>Enviar sugerencia</a>
      </div>
    </footer>
  )
}
