import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Categories = () => {
  const [nombre, setNombre] = useState("")
  const [categorias, setCategorias] = useState([])

  const token = localStorage.getItem("tokenLogin")

  if (!token) {
    toast.error("No estás autenticado. Por favor, inicia sesión.");
    return
  }

  const obtenerCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3001/category/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setCategorias(data)
    } catch (error) {
      console.error("Error al obtener categorías", error)
    }
  }

  useEffect(() => {
    obtenerCategorias()
  }, [])

  const buttonSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return toast.error("Escribe un nombre válido")

    try {
      const res = await fetch("http://localhost:3001/category/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nombre }),
      })

      if (res.ok) {
        const nuevaCategoria = await res.json()
        setCategorias([...categorias, nuevaCategoria])
        setNombre("")
        toast.success("Categoría creada exitosamente")
      } else {
        const err = await res.json()
        toast.error("Error al crear: " + err.message)
      }
    } catch (error) {
      console.error("Error al crear categoría", error)
    }
  }

  return (
    <div className='flex flex-col items-center h-screen'>
      <div className='p-3 bg-gray-600 text-center text-white text-3xl font-bold w-full'>Categories</div>
      <form onSubmit={buttonSubmit} className='flex flex-col items-end shadow-2xl w-fit p-10 h-4/12 my-5 
      rounded-2xl'>
        <div className='flex flex-col'>
          <label className='text-slate-700 text-md font-bold text-2xl'>Nombre de la categoria</label>
          <input
            type='text'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder='Tareas'
            className='border-3 border-slate-300 rounded-lg shadow-md focus:outline-none
             focus:border-slate-400 w-full my-2 p-1.5'
          />
        </div>
        <button type='submit' className='bg-slate-700 text-white px-4 py-1 my-4 rounded cursor-pointer
         hover:bg-blue-900'>Agregar</button>
        <p className='w-full text-center text-sm text-gray-400'>Ingresa una categoria nueva</p>
      </form>
      <ul className='shadow-2xl bg-gray-50 w-8/10 p-2 rounded-2xl h-auto overflow-y-auto mb-5'>
        {categorias.length > 0 ? (
          categorias.map(cat => (
            <li key={cat._id} className='w-full px-2 border-b-3 my-2 border-b-slate-900 text-xl
             text-slate-900'>
              {cat.name}
            </li>
          ))
        ) : (
          <li className='text-center text-gray-400'>No hay categorías aún</li>
        )}
      </ul>
    </div>
  )
}

export default Categories


