import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 backdrop-blur-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="px-4 py-4 flex justify-between items-center flex-wrap gap-4">{children}</div>
);

const CardTitle = ({ children }) => (
    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {children}
    </h2>
);

const CardContent = ({ children }) => (
    <div className="p-4">{children}</div>
);

const ProgressChart = ({ tasks = [] }) => {
    const [timeRange, setTimeRange] = useState('week');
    const [offset, setOffset] = useState(0);

    const getPeriodLabel = () => {
        const today = new Date();
        switch (timeRange) {
            case 'week':
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay() - offset * 7);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
            case 'month':
                const monthDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
                return monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
            case 'year':
                return `${today.getFullYear() - offset}`;
        }
    };

    const getChartData = () => {
        switch (timeRange) {
            case 'week':
                return getWeeklyData();
            case 'month':
                return getMonthlyData();
            case 'year':
                return getYearlyData();
            default:
                return getWeeklyData();
        }
    };

    const getWeeklyData = () => {
        const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - offset * 7);

        return daysOfWeek.map((day, index) => {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + index);

            const dayTasks = tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate.toDateString() === currentDate.toDateString();
            });

            return {
                name: day,
                completed: dayTasks.filter(task => task.status === 'completed').length,
                pending: dayTasks.filter(task => task.status === 'pending').length,
            };
        });
    };

    const getMonthlyData = () => {
        const today = new Date();
        const currentMonth = new Date(today.getFullYear(), today.getMonth() - offset, 1);
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const data = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const dayTasks = tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate.toDateString() === currentDate.toDateString();
            });

            data.push({
                name: `${i}`,
                completed: dayTasks.filter(task => task.status === 'completed').length,
                pending: dayTasks.filter(task => task.status === 'pending').length,
            });
        }

        return data;
    };

    const getYearlyData = () => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const today = new Date();
        const currentYear = today.getFullYear() - offset;

        return months.map((month, index) => {
            const monthTasks = tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate.getMonth() === index && taskDate.getFullYear() === currentYear;
            });

            return {
                name: month,
                completed: monthTasks.filter(task => task.status === 'completed').length,
                pending: monthTasks.filter(task => task.status === 'pending').length,
            };
        });
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <div className="flex flex-wrap gap-4 items-center">
                    <CardTitle>
                        Progression {timeRange === 'week' ? 'hebdomadaire' : timeRange === 'month' ? 'mensuelle' : 'annuelle'}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOffset(offset + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            aria-label="Période précédente"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 min-w-[150px] text-center">
                            {getPeriodLabel()}
                        </span>
                        <button
                            onClick={() => offset > 0 && setOffset(offset - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={offset === 0}
                            aria-label="Période suivante"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => {
                            setTimeRange('week');
                            setOffset(0);
                        }}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${timeRange === 'week'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Semaine
                    </button>
                    <button
                        onClick={() => {
                            setTimeRange('month');
                            setOffset(0);
                        }}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${timeRange === 'month'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Mois
                    </button>
                    <button
                        onClick={() => {
                            setTimeRange('year');
                            setOffset(0);
                        }}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${timeRange === 'year'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Année
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backdropFilter: 'blur(4px)',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#4F46E5"
                                strokeWidth={2}
                                dot={{ stroke: '#4F46E5', strokeWidth: 2, r: 4, fill: 'white' }}
                                activeDot={{ r: 6, fill: '#4F46E5' }}
                                name="Complétées"
                            />
                            <Line
                                type="monotone"
                                dataKey="pending"
                                stroke="#9333EA"
                                strokeWidth={2}
                                dot={{ stroke: '#9333EA', strokeWidth: 2, r: 4, fill: 'white' }}
                                activeDot={{ r: 6, fill: '#9333EA' }}
                                name="En attente"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProgressChart;
