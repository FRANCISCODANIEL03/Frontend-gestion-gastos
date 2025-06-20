import { useEffect, useState } from 'react'
import { ArrowDownToLine, ArrowUpToLine, Scale } from 'lucide-react'
import CartIn from '../atoms/CartIn'
import TransactionItem from '../atoms/TransactionItem'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [ingresos, setIngresos] = useState(0);
    const [egresos, setEgresos] = useState(0);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("tokenLogin");
                if (!token) {
                    toast.error("No estás autenticado. Por favor, inicia sesión."); 
                    return
                }

                const response = await fetch("http://localhost:3001/transaction/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    setTransactions(data);

                    const ingresosTotal = data
                        .filter(t => t.type === "ingreso")
                        .reduce((sum, t) => sum + Number(t.amount), 0);

                    const egresosTotal = data
                        .filter(t => t.type === "egreso")
                        .reduce((sum, t) => sum + Number(t.amount), 0);

                    setIngresos(ingresosTotal);
                    setEgresos(egresosTotal);
                } else {
                    toast.error("Error al obtener transacciones: " + data.message);
                }
            } catch (error) {
                console.error("Error de red al obtener transacciones", error);
            }
        }
        fetchTransactions();
    }, []);

    const formatearMoneda = (cantidad) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
        }).format(cantidad);
    };
      
    return (
        <>
            <div className='p-3 bg-gray-600 text-center text-white text-3xl font-bold'>Dashboard</div>
            <main className='flex gap-6 p-10 flex-col'>
                {/* Contenido del Dashboard */}
                <section className='text-xl flex gap-10 text-white justify-center'>
                    <CartIn
                        color={1}
                        cantidad={formatearMoneda(ingresos)}
                        name={"Gastos de ingreso"}
                    >
                        <ArrowUpToLine />
                    </CartIn>
                    <CartIn
                        color={2}
                        cantidad={formatearMoneda(egresos)}
                        name={"Gastos de egreso"}
                    >
                        <ArrowDownToLine />
                    </CartIn>
                    <CartIn
                        color={3}
                        cantidad={formatearMoneda(ingresos - egresos)}
                        name={"Balance"}
                    >
                        <Scale />
                    </CartIn>
                </section>
                <section className='w-12/12 h-100 font-semibold text-xl bg-slate-700 p-2 rounded-3xl'>
                    <h2 className='text-2xl text-center text-white p-2 mb-3'>Últimos 6 Movimientos</h2>
                    <ul className='h-80 overflow-y-auto'>
                        {
                            transactions.slice(0, 6).map((item, index) => (
                                <TransactionItem
                                    transaction={item}
                                    key={index}
                                    formatearMoneda={formatearMoneda}
                                />
                            ))
                        }
                    </ul>
                </section>
            </main>
        </>
    )
}

export default Dashboard

