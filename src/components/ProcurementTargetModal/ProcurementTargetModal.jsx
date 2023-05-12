import { useState, useContext } from 'react';
import { app } from '../../config/firebase'
import { MyModal } from '../'
import swal from 'sweetalert';
import { X } from 'react-feather'
import { Months } from '../../Utils';
import { AuthContext } from '../../Context/auth'

const inputStyle =
    "text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10";


export default function TargetProcurementModal({ isOpen, isClose }) {

    const [targetNumber, setTargetNumber] = useState(0);
    const context = useContext(AuthContext);

    const onSubmit = async (event) => {
        event.preventDefault();

        const dateToday = new Date()

        if (targetNumber === 0) {
            return swal({
                title: "Warning",
                text: `Target shouldnt be 0`,
                icon: "warning",
                button: "Ok",
            });
        }

        try {
            const document = app
                .firestore()
                .collection("targetProcurement")
                .where(
                    "month",
                    "==",
                    Months[dateToday.getMonth()]
                );

            const docs = app
                .firestore()
                .collection("targetProcurement").doc();


            const isExist = await document.get();

            if (!isExist.empty) {
                return swal({
                    title: "Warning",
                    text: `Target already exist`,
                    icon: "warning",
                    button: "Ok",
                });
            }


            addTargetData(docs, dateToday);

        } catch (error) {
            console.log(error.message);
        }
    }

    const addTargetData = (document, dateToday) => {
        try {
            document.set({
                uid: context.uid,
                month: Months[dateToday.getMonth()],
                targetNumber: Number(targetNumber),
                date_created: dateToday.toISOString().substring(0, 10),
            }).then(() => {
                isClose();
                setTargetNumber(0);
                swal({
                    title: "Success",
                    text: `Successfully Added Target`,
                    icon: "success",
                    button: "Ok",
                });
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <MyModal
            className="max-w-sm h-auto mx-auto rounded-lg p-6 relative h-auto w-full"
            isOpen={isOpen}
        >
            <div onClick={isClose}>
                <X
                    className="w-6 h-6 absolute inset-y-4 right-4 cursor-pointer"
                />
            </div>
            <h1 className="text-xl mt-3 mb-4 text-center font-bold">Target Procurement</h1>
            <form onSubmit={onSubmit}>
                <input
                    required
                    type="number"
                    className={`${inputStyle} bg-gray-200 `}
                    value={targetNumber}
                    onChange={(event) => setTargetNumber(event.target.value)}
                    placeholder="Target Number"
                    name="socks"
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                    <button
                        onClick={isClose}
                        className="px-6 py-1 border border-primary bg-gray-100 hover:bg-gray-200 text-black text-sm rounded-sm focus:outline-none focus:shadow-outline "
                    >
                        Cancel
                    </button>
                    <button
                        className="border border-primary bg-primary hover:bg-primary-slight text-white px-8 py-1 text-sm my-3 font-semibold rounded-sm"
                    >
                        Save
                    </button>
                </div>
            </form>
        </MyModal>
    )
}