import { useRef, useEffect } from "react";
import Chart from 'chart.js/auto'
import theme from '../../Utils/Theme'
import { buildScales, buildLegend, updatedDistribution } from '../../Utils/ReusableSyntax'
import { backgroundColor, borderColor, Months } from "../../Utils/index";

export default function DistributionChart({
    dataArray,
    width,
    height,
    axes,
    legend,
    chartType, }) {

    const { fonts } = theme

    const chartDistribution = useRef(null);

    const updatedData = updatedDistribution(dataArray);

    //console.log(dataArray)

    useEffect(() => {
        const ctx = chartDistribution.current;
        //const sortTypes = "quantity"

        //*Sort data from highest to lowest
        // const sortedData = updatedData.sort(
        //     (a, b) => a[sortTypes] - b[sortTypes]
        // );

        const sortedDate = updatedData.sort((a, b) => {
            return new Date(a.distributionDate) - new Date(b.distributionDate)
        });

        const labels = sortedDate.map((type) => {
            const date = new Date(type.distributionDate);
            return Months[date.getMonth()];
        })

        const data = updatedData.map((type) => type.quantity);

        if (data.length > 0) {
            const textTitle = "Distribution Chart";
            var myBarChart = new Chart(ctx, {
                type: chartType,
                data: {
                    labels,
                    datasets: [
                        {
                            data,
                            backgroundColor,
                            borderColor,
                            borderWidth: 1,
                        }
                    ]
                },
                options: {
                    plugins: {
                        scales: buildScales(axes),
                        legend: buildLegend(legend),
                        title: {
                            display: false,
                            text: textTitle,
                            fontSize: 24,
                        },
                        tooltips: {
                            titleFontFamily: fonts.inter,
                            bodyFontFamily: fonts.inter,
                            cornerRadius: 3,
                        },
                    },
                }
            });

            return () => {
                myBarChart.destroy()
            }
        }

    }, [dataArray]);

    return (
        <div className="container mx-auto px-8 py-4 mt-4 sm:block hidden bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-center py-3 text-primary">Distribution Chart</h1>
            <div className="">
                <canvas ref={chartDistribution} height={width} width={height} key={dataArray.length} />
            </div>
        </div>
    )
}