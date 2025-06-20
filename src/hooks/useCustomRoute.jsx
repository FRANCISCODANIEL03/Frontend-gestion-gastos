import { useState } from "react"
import Dashboard from '../routes/Dashboard'
import Login from '../routes/Login'
import Categories from '../routes/Categories'
import Transaction from '../routes/Transaction'
import NotFound from '../routes/NotFound'

const useCustomRoute = () => {
    const [ruta, setRuta] = useState("/")

    const asignarComponent = () => {
        if (ruta === "/") {
            return <Dashboard />
        } else if (ruta === "/login") {
            return <Login />
        } else if (ruta === "/transaction") {
            return <Transaction />
        } else if (ruta === "/categories") {
            return <Categories />
        } else {
            return <NotFound />
        }
    }
    return {setRuta, asignarComponent}
}

export default useCustomRoute


