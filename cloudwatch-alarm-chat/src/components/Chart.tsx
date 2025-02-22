import { Line } from 'react-chartjs-2';
import { Box } from '@mantine/core';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface DataPoint {
    timestamp: number;
    value: number;
}

interface LineChartProps {
    datapoints: DataPoint[];
    label: string;
    options?: any;
}

export const Chart: React.FC<LineChartProps> = ({ datapoints, label, options = {} }) => {
    console.log("DATAPOINTS", datapoints)
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 6,
                    boxHeight: 6
                }
            },
            title: {
                display: true,
                text: `${new Date(datapoints[0]?.timestamp).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`,
            },
        },
    };

    const chartOptions = { ...defaultOptions, ...options };

    const data: ChartData<'line'> = {
        labels: datapoints.map(point => new Date(point.timestamp).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })),
        datasets: [
            {
                label: label,
                data: datapoints.map(point => point.value),
                borderColor: 'rgb(255, 165, 0)',
                backgroundColor: 'rgb(255, 165, 0)',
                tension: 0.1
            }
        ]
    };

    return (
        <Box p="md" style={{ height: '400px', border: '1px solid #eaeaea' }}>
            <Line data={data} options={chartOptions} />
        </Box>
    );
};
