import { useEffect, useState, useContext } from 'react';
import { RiceVarietyContext } from "../../Context/RiceVarietyProvider";
import { Table } from 'antd';

export default function TransactionHistory({ length, Total, column, Transaction }) {
    const [getVariety, setGetVariety] = useState("");
    const [variety, setVariety] = useState(null);
    const { fetchVariety } = useContext(RiceVarietyContext);

    const filteredVariety = () => {
        const filteredVariety = Transaction.filter((obj) => {
            return obj.riceVariety === getVariety
        })

        return getVariety !== "" ? setVariety(filteredVariety) : setVariety(Transaction)
    }

    useEffect(filteredVariety, [getVariety]);


    return (
        <>
            <section className="md:flex items-center justify-between">
                <div className="mb-4 flex items-center gap-6">
                    <div className="text-lg font-bold flex items-center gap-1.5">
                        <h1>Number Of Bidding :{" "}</h1>
                        <strong className="text-red-500">
                            {length}
                        </strong>
                    </div>
                    {Total && (
                        <div className="text-lg font-bold flex items-center gap-1.5">
                            <h1>Total Price :{" "}</h1>
                            <strong className="text-red-500">
                                {Total}
                            </strong>
                        </div>
                    )}
                </div>
                <div className="flex  md:gap-2">
                    <div className="text-lg font-bold mt-1">
                        <h1>Filtered By : </h1>
                    </div>
                    <select
                        id="getVariety"
                        name="getVariety"
                        className="w-72 mb-4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={getVariety}
                        onChange={(event) => setGetVariety(event.target.value)}
                    >
                        <option value=""></option>
                        {fetchVariety.map((variety) => (
                            <option value={variety.variety}>{variety.variety}</option>
                        ))}
                    </select>
                </div>
            </section>
            <div className="z-10">
                <Table
                    className="overflow-auto"
                    columns={column}
                    rowKey={(Transaction) => Transaction.id}
                    dataSource={variety}
                    pagination={false}
                />
            </div>
        </>
    )
}