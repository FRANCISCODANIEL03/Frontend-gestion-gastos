import { useEffect, useState } from 'react'
import TransactionItem from '../atoms/TransactionItem'
import toast from 'react-hot-toast'

const Transaction = () => {
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("ingreso")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const token = localStorage.getItem("tokenLogin")
  if (!token) {
    toast.error("No estás autenticado. Por favor, inicia sesión.");
    return
  }

  const getTransactions = async () => {
    try {
      const res = await fetch("http://localhost:3001/transaction", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      console.error(" Error al cargar transacciones", err)
    }
  }

  const getCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/category/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setCategories(data)
      if (data.length > 0) setCategory(data[0]._id)
    } catch (err) {
      console.error(" Error al cargar categorías", err)
    }
  }

  useEffect(() => {
    getTransactions()
    getCategories()
  }, [])

  const buttonSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim() || !amount || !type || !category) {
      toast.error("Completa todos los campos")
      return
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      toast.error("El monto debe ser un número positivo")
      return
    }
    if (description.length < 3) {
      toast.error("La descripción debe tener al menos 3 caracteres")
      return
    }

    try {
      const res = await fetch("http://localhost:3001/transaction/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, amount: Number(amount), type, category }),
      })

      if (res.ok) {
        const nueva = await res.json()
        setTransactions([...transactions, nueva])
        setDescription("")
        setAmount("")
        setType("ingreso")
        setCategory(categories[0]?._id || "")
        toast.success("Transacción agregada exitosamente")
      } else {
        const err = await res.json()
        toast.error("Error al agregar: " + err.message)
      }
    } catch (err) {
      toast.error("Error al agregar transacción", err)
    }
  }

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(cantidad);
  };

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex flex-col items-center h-screen'>
      <div className='p-3 bg-gray-600 text-center text-white text-3xl font-bold w-full'>Transactions</div>
      <div className='w-full flex'>
        <form onSubmit={buttonSubmit} className='flex flex-col items-end shadow-2xl w-5/12 p-8 px-30 
        rounded-2xl m-10'>
          <div className='flex flex-col w-full'>
            <label className='text-slate-700 text-md font-bold text-2xl'>Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} 
            placeholder='Realizar mantenimiento' className='border-3 border-slate-300 rounded-lg 
            shadow-md focus:outline-none focus:border-slate-400 w-full my-2 px-4'></textarea>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-slate-700 text-md font-bold text-2xl w-full'>Monto</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder='2000' 
            className='border-3 border-slate-300 rounded-lg shadow-md focus:outline-none
             focus:border-slate-400 w-full my-2 p-1.5' />
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-slate-700 text-md font-bold text-2xl'>Tipo</label>
            <select value={type} onChange={e => setType(e.target.value)} className='border-3
             border-slate-300 rounded-lg shadow-md focus:outline-none focus:border-slate-400 
             w-full my-2 p-1.5'>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-slate-700 text-md font-bold text-2xl'>Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className='border-3
             border-slate-300 rounded-lg shadow-md focus:outline-none focus:border-slate-400 w-full
              my-2 p-1.5'>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button className='bg-slate-700 text-white px-6 py-2 my-4 rounded cursor-pointer
           hover:bg-blue-900'>Agregar</button>
          <p className='w-full text-center text-sm text-gray-400'>Ingresa un movimiento nuevo</p>
        </form>
        <div className='w-5/12'>
          <form className='w-full flex justify-end my-4'>
            <input
              type="text"
              placeholder='Buscar...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='border-3 border-slate-300 rounded-lg shadow-md focus:outline-none
               focus:border-slate-400 my-2 p-1.5'
            />
          </form>
          <ul className='h-130 overflow-y-auto px-3 rounded-2xl'>
            {filteredTransactions.map((movimiento, i) => (
              <TransactionItem
                transaction={movimiento}
                key={i}
                formatearMoneda={formatearMoneda}
                destacado={searchTerm.length > 0}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Transaction
