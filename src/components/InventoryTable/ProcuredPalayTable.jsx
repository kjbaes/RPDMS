import { Table, Tag, } from 'antd'
import { sortTypes, sortRiceVariety, monthDiff } from "../../Utils/ReusableSyntax"

export default function ProcuredPalayTable({ riceMilled }) {

    const dateToday = new Date();

    //**Rice Milled */
    const riceMilledColumn = [
        {
            title: "Unique Identification",
            dataIndex: "id",
            key: "id",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
            render: (text) => {
                return <span className="text-blue-500">{text}</span>;
            },
        },
        {
            title: "Age of Rice Milled",
            dataIndex: "dateMilled",
            key: "dateMilled",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
            render: (dateMilled) => {
                const date = dateMilled !== undefined && new Date(dateMilled.seconds * 1000)

                const milledAge = monthDiff(date, dateToday);


                let color = milledAge <= 5 && 'lime';

                if (milledAge >= 6) {
                    color = 'orange'
                }

                if (milledAge >= 9) {
                    color = 'red'
                }

                return (
                    <Tag color={color}>
                        <span>{milledAge} old</span>
                    </Tag>
                )
            }
        },
        {
            title: "Date of Rice Milled",
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
        {
            title: "Rice Variety",
            dataIndex: "riceVariety",
            key: "riceVariety",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
        },
        {
            title: "Total Sacks",
            dataIndex: "totalSocks",
            key: "totalSocks",
            setDirections: sortTypes,
            sorter: sortRiceVariety,
            render: (totalSocks) => {
                return (
                    <span className="bg-blue-400 py-1 px-2 font-bold rounded-full text-white">{totalSocks && totalSocks.toLocaleString()}</span>
                )
            }
        },
    ];

    return (
        <div>
            <Table
                className="overflow-auto"
                columns={riceMilledColumn}
                rowKey={(riceMilled) => riceMilled.id}
                dataSource={riceMilled}
                pagination={false}
            />
        </div>
    )
}