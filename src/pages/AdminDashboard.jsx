import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Users, Globe, Clock, Activity, TrendingUp, Eye, 
  Filter, Download, RefreshCw, Calendar, MapPin,
  BarChart3, PieChart as PieChartIcon, Settings
} from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'last_7_days',
    toolName: '',
    country: ''
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const testUrl = `/api/analytics?adminKey=${encodeURIComponent(adminKey)}`;
      console.log('Testing admin authentication with URL:', testUrl);
      
      const response = await fetch(testUrl);
      
      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_key', adminKey);
        console.log('Authentication successful');
        await loadAnalyticsData();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Authentication failed:', response.status, errorData);
        setError(`Authentication failed: ${errorData.message || 'Invalid admin key'}`);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Failed to authenticate: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load analytics data
  const loadAnalyticsData = async () => {
    setLoading(true);
    setError('');

    try {
      const currentAdminKey = adminKey || localStorage.getItem('admin_key') || '';
      
      // Build URL manually to avoid encoding issues with special characters
      let url = `/api/analytics?adminKey=${encodeURIComponent(currentAdminKey)}`;

      if (filters.dateRange !== 'all_time') {
        const dateRange = getDateRange(filters.dateRange);
        if (dateRange) {
          url += `&dateRange=${encodeURIComponent(dateRange)}`;
        }
      }

      if (filters.toolName) {
        url += `&toolName=${encodeURIComponent(filters.toolName)}`;
      }

      if (filters.country) {
        url += `&country=${encodeURIComponent(filters.country)}`;
      }

      console.log('Fetching analytics data from:', url);

      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
        console.log('Analytics data loaded successfully:', result.summary);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setError(`Failed to load analytics data: ${errorData.message || response.statusText}`);
        console.error('API Error:', response.status, errorData);
      }
    } catch (err) {
      setError('Error loading data: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (range) => {
    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case 'last_24_hours':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'last_7_days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last_30_days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last_90_days':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        return null;
    }

    return `${startDate.toISOString().split('T')[0]},${now.toISOString().split('T')[0]}`;
  };

  // Check for existing admin session
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
      loadAnalyticsData();
    }
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadAnalyticsData();
    }
  }, [filters]);

  const logout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    setData(null);
    localStorage.removeItem('admin_key');
  };

  const exportData = () => {
    if (!data?.data) return;
    
    const exportData = {
      exported_at: new Date().toISOString(),
      summary: data.summary,
      filters_applied: filters,
      data: data.data
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkrank-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!data?.data) return {};

    // Daily usage data
    const dailyData = Object.entries(data.data.daily_stats || {})
      .map(([date, stats]) => ({
        date,
        sessions: stats.total_sessions,
        users: stats.unique_users,
        toolUses: stats.tool_uses,
        pageViews: stats.page_views
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Last 30 days

    // Tool usage data
    const toolData = Object.entries(data.data.tools || {})
      .map(([name, tool]) => ({
        name: name.replace(/([A-Z])/g, ' $1').trim(),
        uses: tool.total_uses,
        users: tool.unique_users,
        successRate: tool.success_rate
      }))
      .sort((a, b) => b.uses - a.uses)
      .slice(0, 15);

    // Country data
    const countryData = Object.entries(data.data.countries || {})
      .map(([name, country]) => ({
        name,
        sessions: country.total_sessions,
        users: country.total_users,
        toolUses: country.total_tool_uses,
        avgDuration: Math.round(country.avg_session_duration / 1000 / 60) // minutes
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);

    return { dailyData, toolData, countryData };
  };

  const { dailyData = [], toolData = [], countryData = [] } = prepareChartData();

  // Calculate summary stats
  const getSummaryStats = () => {
    if (!data?.data) return {};

    const totalSessions = Object.keys(data.data.sessions || {}).length;
    const totalToolUses = Object.values(data.data.tools || {}).reduce((sum, tool) => sum + tool.total_uses, 0);
    const totalCountries = Object.keys(data.data.countries || {}).length;
    const avgSessionDuration = Object.values(data.data.sessions || {}).reduce((sum, session) => sum + (session.duration || 0), 0) / totalSessions;

    return {
      totalSessions,
      totalToolUses,
      totalCountries,
      avgSessionDuration: Math.round(avgSessionDuration / 1000 / 60) // minutes
    };
  };

  const stats = getSummaryStats();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Enter your admin key to access analytics</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Hidden username field for accessibility */}
            <input
              type="text"
              name="username"
              value="admin"
              autoComplete="username"
              style={{ display: 'none' }}
              readOnly
            />
            
            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Key
              </label>
              <input
                type="password"
                id="adminKey"
                name="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin key..."
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LinkRank.ai Analytics</h1>
              <p className="text-gray-600">Comprehensive dashboard and reporting</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={exportData}
                disabled={!data?.data}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>

              <button
                onClick={loadAnalyticsData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tools', label: 'Tool Usage', icon: Activity },
              { id: 'geography', label: 'Geography', icon: Globe },
              { id: 'sessions', label: 'User Sessions', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading analytics data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {data && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>

                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="last_24_hours">Last 24 Hours</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="last_90_days">Last 90 Days</option>
                  <option value="all_time">All Time</option>
                </select>

                <select
                  value={filters.toolName}
                  onChange={(e) => setFilters(prev => ({ ...prev, toolName: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">All Tools</option>
                  {Object.keys(data.data.tools || {}).map(tool => (
                    <option key={tool} value={tool}>{tool}</option>
                  ))}
                </select>

                <select
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">All Countries</option>
                  {Object.keys(data.data.countries || {}).map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalSessions?.toLocaleString() || '0'}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tool Uses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalToolUses?.toLocaleString() || '0'}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Countries</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalCountries?.toLocaleString() || '0'}</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Session</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgSessionDuration || 0}m</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Activity Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="sessions" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="toolUses" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Tools Pie Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Tools Usage</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={toolData.slice(0, 8)}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="uses"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {toolData.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Tool Usage Analytics</h3>
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={toolData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="uses" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Tool Usage Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Uses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Users</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {toolData.map((tool, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tool.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tool.uses.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tool.users.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tool.successRate >= 90 ? 'bg-green-100 text-green-800' :
                              tool.successRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tool.successRate.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'geography' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Country Usage Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage by Country</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={countryData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Country Table */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Country Analytics</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool Uses</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Duration</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {countryData.map((country, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{country.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{country.sessions.toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{country.toolUses.toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{country.avgDuration}m</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent User Sessions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tools Used</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.values(data.data.sessions || {}).slice(-20).reverse().map((session, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            {session.session_id?.slice(-8) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.country}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Math.round(session.duration / 1000 / 60)}m
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.page_views}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.tools_used.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(session.start_time).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}