import styles from 'styles/Share.module.css'

export default function Share () {
  const urlBase = 'https://covid-vacuna-ar.vercel.app/'
  const params = new URLSearchParams({
    url: urlBase,
    text:
      '¡Sigue el progreso de la vacunación contra el COVID19 en esta web adaptada por @fom78a para Argentina y creada por @midudev!\n\n'
  })
  // const leyendaWpp =
  //   "¡Sigue el progreso de la vacunación contra el COVID19 en esta web adaptada por @fom78a para Argentina y creada por @midudev!\n\n";

  const url = `https://twitter.com/share?${params}`
  // const urlWpp = `whatsapp://send?text=fffff%20https://covid-vacuna-ar.vercel.app/`
  const urlWpp = `https://api.whatsapp.com/send?text=${urlBase}`
  // ver
  const TwitterLogo = () => (
    <svg viewBox='0 0 612 612' width='24'>
      <path
        d='M612 116.258a250.714 250.714.0 01-72.088 19.772c25.929-15.527 45.777-40.155 55.184-69.411-24.322 14.379-51.169 24.82-79.775 30.48-22.907-24.437-55.49-39.658-91.63-39.658-69.334.0-125.551 56.217-125.551 125.513.0 9.828 1.109 19.427 3.251 28.606-104.326-5.24-196.835-55.223-258.75-131.174-10.823 18.51-16.98 40.078-16.98 63.101.0 43.559 22.181 81.993 55.835 104.479a125.556 125.556.0 01-56.867-15.756v1.568c0 60.806 43.291 111.554 100.693 123.104-10.517 2.83-21.607 4.398-33.08 4.398-8.107.0-15.947-.803-23.634-2.333 15.985 49.907 62.336 86.199 117.253 87.194-42.947 33.654-97.099 53.655-155.916 53.655-10.134.0-20.116-.612-29.944-1.721 55.567 35.681 121.536 56.485 192.438 56.485 230.948.0 357.188-191.291 357.188-357.188l-.421-16.253c24.666-17.593 46.005-39.697 62.794-64.861z'
        fill='#1da1f2'
      />
    </svg>
  )

  function WhatsAppsLogo (props) {
    return (
      <svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg' {...props}>
        <style />
        <g id='prefix__WA'>
          <path
            d='M5 59l12-3.3c4.3 2.7 9.5 4.3 15 4.3 15.5 0 28-12.5 28-28S47.5 4 32 4 4 16.5 4 32c0 5.5 1.6 10.7 4.3 15L5 59z'
            fill='#25d366'
            stroke='#fff'
            strokeWidth={5}
            strokeMiterlimit={10}
          />
          <path
            d='M45.9 39.6c-1.9 4-5.4 4.5-5.4 4.5-3 .6-6.8-.7-9.8-2.1-4.3-2-8-5.2-10.5-9.3-1.1-1.9-2.1-4.1-2.2-6.2 0 0-.4-3.5 3-6.3.3-.2.6-.3 1-.3h1.5c.6 0 1.2.4 1.4 1l2.3 5.6c.2.6.1 1.2-.3 1.7l-1.5 1.6c-.5.5-.5 1.2-.2 1.8.1.2.3.5.6.8 1.8 2.4 4.2 4.2 6.9 5.4.4.2.7.3 1 .4.7.2 1.3-.1 1.7-.6l1.2-1.8c.3-.5.9-.8 1.5-.7l6 .9c.6.1 1.1.6 1.3 1.2l.4 1.5c.2.2.2.6.1.9z'
            fill='#fff'
          />
        </g>
      </svg>
    )
  }

  return (

    <div className={styles.share}>

      <a
        target='_blank'
        rel='nofollow noopener noreferrer'
        href={url}
        title='Comparte este enlace en Twitter'
      >
        <TwitterLogo />
      </a>

      <a
        target='_blank'
        rel='nofollow noopener noreferrer'
        href={urlWpp}
        title='Comparte este enlace en Whatsapp'
      >
        <WhatsAppsLogo />
      </a>
    </div>

  )
}
