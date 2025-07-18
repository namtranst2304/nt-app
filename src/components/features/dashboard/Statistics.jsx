import { memo, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Video, Eye, TrendingUp } from 'lucide-react';
import useAppStore from '@/lib/store/useAppStore';

// Memoized StatCard component
const StatCard = memo(({ stat, index, getColorClass }) => (
  <motion.div
    className="glass-card p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${getColorClass(stat.color)} rounded-lg flex items-center justify-center`}>
        <stat.icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-green-400 text-sm font-medium">{stat.change}</span>
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
    <p className="text-gray-400">{stat.title}</p>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const Statistics = memo(() => {
  const { statistics, watchHistory } = useAppStore();

  // Memoized data calculations
  const { categoryData, stats, weeklyData } = useMemo(() => {
    const categoryData = [
      { name: 'React', value: 35, color: '#3B82F6' },
      { name: 'JavaScript', value: 25, color: '#10B981' },
      { name: 'CSS', value: 20, color: '#F59E0B' },
      { name: 'Node.js', value: 15, color: '#EF4444' },
      { name: 'Others', value: 5, color: '#8B5CF6' }
    ];

    const stats = [
      {
        title: 'Total Watch Time',
        value: statistics?.totalWatchTime ?? 0,
        icon: Clock,
        color: 'blue',
        change: '+12%'
      },
      {
        title: 'Videos Watched',
        value: statistics?.videosWatched ?? 0,
        icon: Video,
        color: 'green',
        change: '+8%'
      },
      {
        title: 'Average Session',
        value: statistics?.averageSessionTime ?? 0,
        icon: Eye,
        color: 'purple',
        change: '+5%'
      },
      {
        title: 'Learning Streak',
        value: '24 days',
        icon: TrendingUp,
        color: 'orange',
        change: '+3 days'
      }
    ];

    const weeklyData = [
      { name: 'Mon', watched: 45, planned: 60 },
      { name: 'Tue', watched: 52, planned: 60 },
      { name: 'Wed', watched: 38, planned: 60 },
      { name: 'Thu', watched: 67, planned: 60 },
      { name: 'Fri', watched: 43, planned: 60 },
      { name: 'Sat', watched: 71, planned: 60 },
      { name: 'Sun', watched: 58, planned: 60 }
    ];

    return { categoryData, stats, weeklyData };
  }, [statistics]);
  const getColorClass = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color];
  };

  return (
    <motion.div 
      className="flex-1 p-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
        <p className="text-gray-400">Track your learning progress and viewing habits</p>
      </motion.div>{/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            stat={stat}
            index={index + 2}
            getColorClass={getColorClass}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div 
          className="glass-card p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Weekly Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />                <Bar 
                  dataKey="watched" 
                  fill="url(#colorGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Content Categories */}
        <motion.div 
          className="glass-card p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Content Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-300">{item.name}</span>
                <span className="text-sm text-gray-400 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div 
        className="glass-card p-6 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>        <div className="space-y-4">
          {watchHistory.slice(0, 5).map((video) => (
            <div key={video.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-16 h-10 rounded object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-white">{video.title}</h4>
                <p className="text-sm text-gray-400">{video.watchedAt}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">{video.progress}% complete</div>
                <div className="w-20 h-1 bg-white/20 rounded-full mt-1">
                  <div 
                    className="h-1 bg-blue-500 rounded-full"
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}        </div>
      </motion.div>
    </motion.div>
  );
});

Statistics.displayName = 'Statistics';

export default Statistics;
