import { useState } from 'react'
import ImagenLogin from '../img/login.svg'
import toast from 'react-hot-toast'

const Login = ({ setNavVisiblity, setRuta }) => {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const buttonSubmit = async (e) => {
    e.preventDefault()

    if (isRegister && password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    const endpoint = isRegister ? "register" : "login"

    const datos = {
      email,
      password
    }

    const token = isRegister ? localStorage.getItem("tokenRegister") : localStorage.getItem("tokenLogin");

    try {
      const response = await fetch(`http://localhost:3001/user/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`${isRegister ? "Registro exitoso" : "Inicio de sesión exitoso"}`)
        if (endpoint == "login") {
          localStorage.setItem("tokenLogin", data.token)
          setNavVisiblity(true)
          setRuta("/")
        }else{
          localStorage.setItem("tokenRegister", data.token)
          setIsRegister(false)
        }
      } else {
        toast.error(` Error: ${data.message}`)
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-slate-100'>
      <form className='w-9/12 h-8/10 bg-white/80 shadow-lg rounded-2xl flex' onSubmit={buttonSubmit}>
        <img src={ImagenLogin} className='w-3/6 h-full rounded-2xl' />
        <div className='w-4/6 flex flex-col justify-start items-start p-2'>
          <p className='w-full text-end p-2'>
            {isRegister ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}
            <a onClick={() => setIsRegister(!isRegister)} className='ms-1 text-emerald-500 cursor-pointer'>
              {isRegister ? "Inicia sesión aquí" : "Crea una cuenta aquí"}
            </a>
          </p>
          <h1 className='text-slate-600 text-xl w-full mt-20'>
            {isRegister ? "Aún no tienes una cuenta" : "Ya tienes una cuenta"}
          </h1>
          <h2 className='text-slate-800 font-bold text-xl w-full mt-2'>
            {isRegister ? "Regístrate aquí" : "Inicia sesión aquí"}
          </h2>
          <div className='flex flex-col w-full items-start gap-3 my-2'>
            <div className='w-full flex flex-col'>
              <label className='text-slate-700 text-md font-bold'>Correo electronico</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} required className='border-3 border-slate-300 rounded-lg shadow-md focus:outline-none focus:border-slate-600 w-9/12 p-1.5' />
            </div>
            <div className='w-full flex flex-col'>
              <label className='text-slate-700 text-md font-bold'>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className='border-3 border-slate-300 rounded-lg shadow-md focus:outline-none focus:border-slate-600 w-9/12 p-1.5' />
            </div>
            {isRegister && (
              <div className='w-full flex flex-col'>
                <label className='text-slate-700 text-md font-bold'>Confirmar Contraseña</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className='border-3 border-slate-300 rounded-lg shadow-md focus:outline-none focus:border-slate-600 w-9/12 p-1.5' />
              </div>
            )}
          </div>
          <button type='submit' className='bg-emerald-500 w-4/12 p-2 text-white text-lg hover:bg-emerald-600 hover:cursor-pointer mt-4 rounded-lg'>
            {isRegister ? "Regístrate" : "Ingresar"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
