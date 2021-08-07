
import Image from 'next/image'
import NumberDigits from 'components/NumberDigits'
import styles from 'styles/Home.module.css'

export default function Vacuna ({ alt='Logo',src,height,width,cantidad=0 }) {

const cantidadAMostrar = (!cantidad) ? 0 : cantidad
  return (
    (cantidad)  
    ?
    (<small>
    <Image
      alt={alt}
      className={styles.companyLogo}
      src={src}
      height={height}
      width={width}
      priority
    />
    <span>
      <NumberDigits>
        {cantidadAMostrar}
      </NumberDigits>
    </span>
  </small>)
  : null
  )
}