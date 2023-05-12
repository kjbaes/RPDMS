import { useRef, useEffect, useState } from "react";
import { Pie } from '@ant-design/charts';
// import Chart from 'chart.js/auto'
import { filterDistribution } from '../../Utils/ReusableSyntax'
// import { colors } from "../../Utils";

export default function PieChart({
    distribution,
    width,
    height,
    axes,
    legend,
    chartType,
}) {


    const distributionChart = useRef(null);
    const [data, setData] = useState([]);

    useEffect(async () => {
        // const ctx = distributionChart.current;

        // const filteredData = distribution.filter((thing, index, self) => {
        //     return index === self.findIndex((t) => (
        //         t.distributionType === thing.distributionType
        //     ))
        // })

        const police = filterDistribution(distribution, "Police")
        const market = filterDistribution(distribution, "Market")
        const relief = filterDistribution(distribution, "Relief Operation")

        const totalPercent = 100;

        const policeTotal = (totalPercent * police.length) / totalPercent;
        const marketTotal = (totalPercent * market.length) / totalPercent;
        const reliefTotal = (totalPercent * relief.length) / totalPercent;

        const data = await Promise.all([policeTotal, marketTotal, reliefTotal]);

        //const labels = filteredData.map((obj) => obj.distributionType);

        var datas = [
            {
                type: "Police",
                value: data[0],
            },
            {
                type: "Market",
                value: data[1],
            },
            {
                type: "Relief Operation",
                value: data[2],
            },
        ];

        setData(datas)
    }, [distribution]);

    var config = {
        appendPadding: 10,
        data: data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        legend: true,
        label: {
            type: 'inner',
            offset: '-30%',
            content: function content(_ref) {
                var percent = _ref.percent;
                return ''.concat((percent * 100).toFixed(0), '%');
            },
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [{ type: 'element-active' }],
    };


    return (
        <div className="container mx-auto px-8 py-4 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-center py-3 text-primary">Distribution Pie Chart</h1>
            <div className="">
                <Pie {...config} />
                {/* <canvas ref={distributionChart} height={width} width={height} /> */}
            </div>
        </div>
    )
}