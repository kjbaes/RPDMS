import { useContext, useState } from 'react';
import { Card } from '../../components'
import { TransactionContext } from '../../Context/TransactionProvider'
import { filteredPendingTransaction, } from '../../Utils/ReusableSyntax'
import { Drawer, Divider } from 'antd'
import { AuthContext } from '../../Context/auth'
import { app } from '../../config/firebase'
import { Link } from 'react-router-dom'
import UseTargetPocurement from '../../lib/UseTargetPocurement'
import swal from 'sweetalert'

export default function NFACart() {
    const [isDrawer, setDrawer] = useState(false);
    const { finishTransaction } = useContext(TransactionContext);
    const context = useContext(AuthContext);

    const { getTarget } = UseTargetPocurement();

    const showDrawer = () => setDrawer((isDrawer) => !isDrawer);

    const pendingTransactions = filteredPendingTransaction(finishTransaction, context);

    const subTotal = pendingTransactions.reduce((a, b) => a + b.total, 0);

    const onSubmit = (event) => {
        event.preventDefault();

        const document = app.firestore();
        const transactionId = pendingTransactions.map((type) => type.id);
        const productId = pendingTransactions.map((type) => type.productId);

        const isCheckTarget = Number(getTarget.targetNumber) !== 0;

        if (isCheckTarget) {
            return swal({
                title: "Warning",
                text: `Target procurement still have ${getTarget.targetNumber}`,
                icon: "warning",
                button: "Ok",
            });
        }

        transactionId.map((id) => {
            const documentTransaction = document.collection("transaction").doc(id);

            documentTransaction.update({
                status: "success"
            });
        })

        updateTargetProcurement(productId, document);
    }

    const updateTargetProcurement = (id, document) => {
        try {
            const documentTarget = document.collection("targetProcurement").doc(getTarget.id);

            documentTarget.update({
                purchaseItems: id
            }).then(() => {
                swal({
                    title: "Success",
                    text: `Checkout Successfully`,
                    icon: "success",
                    button: "Ok",
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    const isCartEmpty = pendingTransactions.length === 0;

    return (
        <div>
            <Drawer title="Checkout" onClose={showDrawer} visible={isDrawer} width={400}>
                <div className="w-full md:px-4 md:mt-0 mt-6 sm:mt-6">
                    <span className="text-2xl text-black">Product Summary</span>
                    <Divider />
                    <div>
                        {pendingTransactions.map((type) => (
                            <div className="flex justify-between">
                                <span className=" mb-2">{type.riceVariety} :</span>
                                <span className="font-bold text-sm">
                                    {type.socks.toLocaleString()} Sacks
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between mt-6">
                            <span>Total :</span>
                            <span className="font-bold text-xl">
                                {subTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="text-right mt-10">
                        <button onClick={(event) => onSubmit(event)} className="w-full text-lg my-auto bg-transparent border border-blue-500 text-blue-900 hover:bg-blue-200 rounded-full py-3 text-white">
                            Checkout
                        </button>
                    </div>
                </div>
            </Drawer>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-6">Pending Products</h1>
                <button onClick={showDrawer} className={`${isCartEmpty ? "hidden" : 'block'} bg-primary hover:bg-primary-slight text-white px-8 py-2 text-sm my-3 font-semibold rounded-sm`}>
                    Summary
                </button>
            </div>
            {isCartEmpty && (
                <div className="text-center">
                    <h1 className="mb-3">Your Cart is Empty</h1>
                    <Link to="/marketplace" onClick={showDrawer} className={`bg-primary hover:bg-primary-slight text-white px-8 py-2 text-sm my-3 font-semibold rounded-sm`}>
                        <span className="text-white">Go to Market Place</span>
                    </Link>
                </div>
            )}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex justify-center relative">
                {pendingTransactions.map((type) => (
                    <Card imageUrl={type.imageUrl} riceVariety={type.riceVariety} kilograms={type.socks} email={type.userEmail}>
                        <div className="text-center py-2 my-2 bg-primary opacity-80 font-bold text-white rounded-lg cursor-pointer">
                            {type.status}
                        </div>
                    </Card>
                ))}
            </section>
        </div >
    )
}