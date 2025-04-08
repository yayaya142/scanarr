
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { BarChart3, CheckCircle, AlertTriangle, Clock, PlayCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ScanarrLayout from '@/components/ScanarrLayout';
import { getStatistics, triggerNewScan, getDailyScanCounts, ScanStatistics } from '@/lib/mock-data';
import { format, subDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<ScanStatistics | null>(null);
  const [chartData, setChartData] = useState<{date: string; count: number}[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stats = await getStatistics();
      setStatistics(stats);
      
      const dailyCounts = await getDailyScanCounts();
      setChartData(dailyCounts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleStartScan = async () => {
    try {
      setIsScanning(true);
      toast.info('Scan started, this might take a while...');
      
      // Simulate a delay for the scan to complete
      setTimeout(async () => {
        const newScan = await triggerNewScan();
        await loadData(); // Reload data
        setIsScanning(false);
        toast.success(`Scan completed with ${newScan.problemFiles} issues found`);
      }, 3000);
    } catch (error) {
      console.error('Error starting scan:', error);
      toast.error('Failed to start scan');
      setIsScanning(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    // Format date in a user-friendly way
    return date;
  };

  return (
    <ScanarrLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <button 
            className="scanarr-btn scanarr-btn-success flex items-center space-x-2"
            onClick={handleStartScan}
            disabled={isScanning}
          >
            <PlayCircle size={16} />
            <span>{isScanning ? 'Scanning...' : 'Start Scan Now'}</span>
          </button>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="scanarr-card flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recent Scans</p>
              <h3 className="text-2xl font-semibold">{statistics?.totalScans || 0}</h3>
            </div>
          </div>
          
          <div className="scanarr-card flex items-center space-x-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Problematic Files</p>
              <h3 className="text-2xl font-semibold">{statistics?.totalProblemFiles || 0}</h3>
            </div>
          </div>
          
          <div className="scanarr-card flex items-center space-x-4">
            <div className="p-3 bg-secondary rounded-full">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Scan</p>
              <h3 className="text-xl font-semibold">{formatDate(statistics?.lastScanDate)}</h3>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="scanarr-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Scans Over Time</h3>
            <div className="text-xs text-muted-foreground">Last 90 days</div>
          </div>
          
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
                    tickFormatter={(tick) => {
                      // Just display month/day
                      const date = new Date(tick);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      color: '#f9fafb'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8A2BE2"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    name="Scans"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No scan data available
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="scanarr-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="text-sm">{statistics?.lastScanDate ? `Scan completed on ${statistics.lastScanDate}` : 'No recent scans'}</p>
                <p className="text-xs text-muted-foreground">{statistics?.lastScanId ? `Scan ID: ${statistics.lastScanId}` : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScanarrLayout>
  );
};

export default Dashboard;
