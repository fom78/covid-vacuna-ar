import { vacunas, vacunasResto } from 'config/vacunas'
const VER_TOP_VACUNAS = 3

const armarTop = (totales) => {
    const top=totales.sort((a,b)=>b.cantidad-a.cantidad).slice(0,VER_TOP_VACUNAS)

    const cantidadRestante = totales.sort((a,b)=>b.cantidad-a.cantidad).slice(VER_TOP_VACUNAS)
    let cantidadTotalRestante = 0
    cantidadRestante.map(v => cantidadTotalRestante += v.cantidad)
    const resto = {...vacunasResto, cantidad: cantidadTotalRestante}
    top.push(resto)
    return top
}


export const totalesVacunasPorDosis = (totalesVacunas,modo) => {

    const totales=vacunas.map(vacuna => {
        let cantidadAgrupada = 0
        vacuna[modo].map((tipo, index) => (cantidadAgrupada += totalesVacunas[tipo]))
        return {...vacuna,cantidad:cantidadAgrupada} 
      })
    const top = armarTop(totales)
    return {totales,top}
}

export const totalesVacunas = (primera,segunda) => {
    const totales=primera.totales.map(vacuna => {
        const cantidadTotalDosis = segunda.totales.filter(e => e.nombre === vacuna.nombre)[0].cantidad + vacuna.cantidad
        return {...vacuna,cantidad:cantidadTotalDosis} 
      })
    const top = armarTop(totales)
    return {totales,top}
}

