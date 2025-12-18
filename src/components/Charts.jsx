import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);


const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: '#A1A1AA',
                font: {
                    family: 'Inter',
                    size: 12,
                    weight: '500'
                },
                padding: 16,
                usePointStyle: true,
            }
        },
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255,255,255,0.05)',
                drawBorder: false,
            },
            ticks: {
                color: '#71717A',
                font: { family: 'Inter', size: 11 }
            }
        },
        y: {
            grid: {
                color: 'rgba(255,255,255,0.05)',
                drawBorder: false,
            },
            ticks: {
                color: '#71717A',
                font: { family: 'Inter', size: 11 }
            },
            beginAtZero: true,
        },
    },
};

export const FuelChart = ({ labels, data: chartData }) => {
    const options = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: false,
            },
        },
    };

    const data = {
        labels: labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Fuel Consumption (L)',
                data: chartData || [1200, 1900, 1500, 2100, 1800, 2300],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export const MaintenanceChart = ({ labels, data: chartData }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#A1A1AA',
                    font: {
                        family: 'Inter',
                        size: 12,
                        weight: '500'
                    },
                    padding: 16,
                    usePointStyle: true,
                },
            },
        },
    };

    const data = {
        labels: labels || ['Tires', 'Oil Change', 'Repairs', 'Inspection'],
        datasets: [
            {
                label: 'Costs (€)',
                data: chartData || [500, 300, 1200, 200],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    return <Doughnut data={data} options={options} />;
};
