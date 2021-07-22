export interface calculatePriceParams {
  state: string
  hasPrevQuotes: boolean
  gallons: number
}
const calculatePrice = ({
  state,
  hasPrevQuotes,
  gallons,
}: calculatePriceParams) => {
  const currPrice = 1.5

  const locFactor = state != 'TX' ? 0.04 : 0.02

  const histFactor = hasPrevQuotes ? 0.01 : 0.0

  const bigFactor = gallons > 1000 ? 0.02 : 0.03

  const profitFactor = 0.1

  const margin = (locFactor - histFactor + bigFactor + profitFactor) * currPrice
  const ppg = margin + currPrice

  const totalPrice = ppg * gallons

  const storedPrice = Math.ceil(totalPrice * 100)

  return { storedPrice, ppg, currPrice }
}

export default calculatePrice
