
const NavLi = ({ setHook, children }) => {
    return (
        <button onClick={setHook}
            className="flex transition delay-75 duration-300 ease-out hover:-translate-y-1 hover:scale-110 m-3 p-2 rounded-xl border border-none  text-gray-500 font-bold text-2xl hover:text-black">
            {children}
        </button>
    )
}

export default NavLi