
import Image from 'next/image'
import NumberDigits from 'components/NumberDigits'
import styles from 'styles/Home.module.css'

export default function Vacuna ({ vacuna }) {
  const cantidadAMostrar = (!vacuna.cantidad) ? 0 : vacuna.cantidad

  return (
    (vacuna)
      ? (
        <small>
          <Image
            alt={vacuna.alt}
            className={styles.companyLogo}
            src={vacuna.src}
            height={vacuna.height}
            width={vacuna.width}
            priority
          />
          <span>
            <NumberDigits>
              {cantidadAMostrar}
            </NumberDigits>
          </span>  
        </small>
      )
      : null   
  )

}