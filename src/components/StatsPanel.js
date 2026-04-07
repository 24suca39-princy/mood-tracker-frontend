import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#ff7f50', '#06b6d4', '#2dd4bf', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatsPanel({ stats }) {
  const chartData = Object.entries(stats.moodDistribution || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <section className="stats-panel card">
      <div className="stats-head">
        <h2>Analytics</h2>
        <span className="total-pill">Total Habits: {stats.totalHabits || 0}</span>
      </div>

      {chartData.length ? (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={88}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="muted-text">No analytics data available yet.</p>
      )}
    </section>
  );
}

export default StatsPanel;
