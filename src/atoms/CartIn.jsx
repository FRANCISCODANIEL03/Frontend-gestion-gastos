const CartIn = ({ children, cantidad, name, color }) => {
  const colorClass = {
    1: 'text-green-300',
    2: 'text-red-600',
    3: 'text-white'
  }[color] || 'text-gray-500' // fallback

  return (
    <div className='my-3 shadow-2xl bg-gray-600 p-7 rounded-2xl'>
      <h2 className={`${colorClass} text-2xl flex font-bold border-b-3 mb-2`}>
        {children}{cantidad}</h2>
      <p>{name}</p>
    </div>
  )
}

export default CartIn

