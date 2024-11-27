import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 backdrop-blur-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="px-6 py-4">{children}</div>
);

const CardTitle = ({ children }) => (
    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {children}
    </h2>
);

const CardContent = ({ children }) => (
    <div className="p-6">{children}</div>
);

const ProgressChart = ({ tasks = [] }) => {
    const getWeeklyData = () => {
        const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

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
                pending: dayTasks.filter(task => task.status === 'pending').length
            };
        });
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Progression hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getWeeklyData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backdropFilter: 'blur(4px)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#4F46E5"
                                strokeWidth={2}
                                dot={{ stroke: '#4F46E5', strokeWidth: 2, r: 4, fill: 'white' }}
                                activeDot={{ r: 6, fill: '#4F46E5' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="pending"
                                stroke="#9333EA"
                                strokeWidth={2}
                                dot={{ stroke: '#9333EA', strokeWidth: 2, r: 4, fill: 'white' }}
                                activeDot={{ r: 6, fill: '#9333EA' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProgressChart;