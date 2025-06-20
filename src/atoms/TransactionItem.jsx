import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react'

const TransactionItem = ({ transaction, formatearMoneda, destacado }) => {
  const color = transaction.type === "ingreso" ? "green-300" : "red-600"
  const fecha = new Date(transaction.date)
  const tiempoRelativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

  const now = new Date()
  const minutos = Math.round((fecha - now) / (1000 * 60))

  return (
    <li className={`bg-white p-4 rounded-3xl shadow-2xl w-full flex justify-between mb-5 ${destacado ? 
    'border-4 border-yellow-400' : ''}`}>
      <div className='flex'>
        <div className={`p-4 text-${color}`}>
          {transaction.type === "ingreso" ? <ArrowUpToLine /> : <ArrowDownToLine />}
        </div>
        <div>
          <h3 className='text-2xl font-bold'>{transaction.description}</h3>
          <small className='text-blue-900'>{transaction.category?.name || "Sin categoría"}</small>
        </div>
      </div>
      <div>
        <span className={`text-${color}`}>{formatearMoneda(transaction.amount)}</span>
        <p className='text-gray-500'>{tiempoRelativo.format(minutos, 'minute')}</p>
      </div>
    </li>
  )
}

export default TransactionItem


