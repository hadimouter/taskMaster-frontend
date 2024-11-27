import React from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Card = ({ children }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 backdrop-blur-lg">
        {children}
    </div>
);

const CardContent = ({ children }) => (
    <div className="p-6">
        {children}
    </div>
);

const StatsCards = ({ tasks = [] }) => {
    const calculateTaskStats = () => {
        if (!Array.isArray(tasks)) return {
            pending: { count: 0, percentage: 0 },
            completed: { count: 0, percentage: 0 },
            overdue: { count: 0, percentage: 0 }
        };

        const today = new Date();
        const totalTasks = tasks.length;
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        const completedTasks = tasks.filter(t => t.status === 'completed');
        const overdueTasks = tasks.filter(t => {
            if (t.status === 'completed') return false;
            const dueDate = new Date(t.dueDate);
            return dueDate < today;
        });

        return {
            pending: {
                count: pendingTasks.length,
                percentage: totalTasks ? Math.round((pendingTasks.length / totalTasks) * 100) : 0
            },
            completed: {
                count: completedTasks.length,
                percentage: totalTasks ? Math.round((completedTasks.length / totalTasks) * 100) : 0
            },
            overdue: {
                count: overdueTasks.length,
                percentage: totalTasks ? Math.round((overdueTasks.length / totalTasks) * 100) : 0
            }
        };
    };

    const stats = calculateTaskStats();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tâches en cours</p>
                            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {stats.pending.count}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                {stats.pending.percentage}% du total
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Progression</span>
                            <span className="text-indigo-600">{stats.pending.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                            <div 
                                className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300" 
                                style={{ width: `${stats.pending.percentage}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tâches terminées</p>
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                                {stats.completed.count}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                {stats.completed.percentage}% du total
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Complété</span>
                            <span className="text-green-500">{stats.completed.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                            <div 
                                className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300" 
                                style={{ width: `${stats.completed.percentage}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tâches en retard</p>
                            <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                                {stats.overdue.count}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                {stats.overdue.percentage}% du total
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">En retard</span>
                            <span className="text-red-500">{stats.overdue.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                            <div 
                                className="h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-300" 
                                style={{ width: `${stats.overdue.percentage}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsCards;