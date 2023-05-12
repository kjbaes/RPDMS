import { useContext, useState, useEffect } from 'react';
import { Divider, Tag, Table } from 'antd';
import {
    sortTypes,
    sortRiceVariety,
} from "../../Utils/ReusableSyntax";
import { TransactionContext } from '../../Context/TransactionProvider';

export default function PriceMonitoring() {

    const [priceFiltered, setPriceFiltered] = useState([])
    const { finishTransaction } = useContext(TransactionContext);

    const columns = [
        {
            title: "Iteration",
            dataIndex: "id",
            key: "id",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
        },
        {
            title: "Palay Variety",
            dataIndex: "riceVariety",
            key: "riceVariety",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
        },

        {
            title: "Min",
            dataIndex: "min",
            key: "min",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
        },
        {
            title: "Max",
            dataIndex: "max",
            key: "max",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
        },
        {
            title: "Average",
            dataIndex: "average",
            key: "average",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
        },
        {
            title: "Date Created",
            dataIndex: "date_created",
            key: "date_created",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
            render: (date_created) => {
                return (
                    <Tag color="geekblue">
                        <span>{new Date(date_created.seconds * 1000).toISOString().substring(0, 10)}</span>
                    </Tag>
                )
            }
        },
    ];


    //Group by rice variety
    function groupBy(collection, property) {
        var i = 0, val, index,
            values = [], result = [];
        for (; i < collection.length; i++) {
            val = collection[i][property];
            index = values.indexOf(val);
            if (index > -1)
                result[index].push(collection[i]);
            else {
                values.push(val);
                result.push([collection[i]]);
            }
        }
        return result;
    }


    const arr = groupBy(finishTransaction, "riceVariety")


    //get min max and add to the obj
    const filteredPrice = Promise.resolve(arr.map((type, index) => {
        const max = Math.max.apply(null, type.map((a) => a.price))
        const min = Math.min.apply(null, type.map((a) => a.price))

        const average = (max + min / arr.length).toFixed(1);

        const arr2 = type.filter((v, i, a) => {
            return a.findIndex(t => (t.riceVariety === v.riceVariety)) === i
        })

        return {
            id: index,
            riceVariety: arr2[0].riceVariety,
            max,
            min,
            average,
            date_created: arr2[0].date_created
        }
    }));

    useEffect(() => {
        filteredPrice.then((response) => {
            setPriceFiltered(response)
        })
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-semibold">Price Monitoring</h1>
            <span className="text-gray-400">
                A Minimum and Maximum price from transaction
            </span>
            <Divider />
            <Table
                className="overflow-auto"
                columns={columns}
                rowKey={(priceFiltered) => priceFiltered.id}
                dataSource={priceFiltered}
                pagination={false}
            />
        </div>
    );
}