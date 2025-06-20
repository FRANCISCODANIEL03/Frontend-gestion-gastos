
import { ArrowDownUp, ChartNetwork, LogOut, SquareStack } from "lucide-react"
import NavLi from "./atoms/NavLi"
import useCustomRoute from "./hooks/useCustomRoute"
import { useState } from "react"
import Login from "./routes/Login"
const App = () => {
  const { setRuta, asignarComponent } = useCustomRoute()

  const [navVisibility, setNavVisiblity] = useState(false)

  

  // Check login token and update state before rendering
  const tokenLogin = localStorage.getItem("tokenLogin");
  if (tokenLogin && !navVisibility) {
    setNavVisiblity(true);
    setRuta("/");
  }

  return (
    <>
      <div className="flex w-full h-full max-md:flex-col">
        {navVisibility && (<div className="flex md:flex-col md:h-screen pt-15 px-5 bg-slate-200 md:justify-between">
          <div className="max-md:flex max-md:text-xl">
            <NavLi setHook={() => setRuta("/")}>
              <ChartNetwork className="mr-2" /> Dashboard
            </NavLi>
            <NavLi setHook={() => setRuta("/categories")}>
              <SquareStack className="mr-2" /> Categories
            </NavLi>
            <NavLi setHook={() => setRuta("/transaction")}>
              <ArrowDownUp className="mr-2" /> Transactions
            </NavLi>
          </div>
          <NavLi setHook={() => {
            setNavVisiblity(false)
            setRuta("/login")
            localStorage.removeItem("tokenLogin")
          }}>
            <LogOut className="mr-2 mt-1"/> Logout
          </NavLi>
        </div>)}
        {navVisibility && (
          <div className="w-full h-full">
            {
              asignarComponent()
            }
          </div>
        )}
        {!navVisibility && (
          <div className="w-full h-full">
            <Login setNavVisiblity={setNavVisiblity} setRuta={setRuta} />
          </div>
        )}

      </div>
    </>
  )
}

export default App



