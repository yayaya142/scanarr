
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Search, Download, FileDown, Filter } from 'lucide-react';
import ScanarrLayout from '@/components/ScanarrLayout';
import { getScans, Scan } from '@/lib/mock-data';
import { format } from 'date-fns';

const History: React.FC = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const data = await getScans();
      setScans(data);
    } catch (error) {
      console.error('Error loading scan history:', error);
      toast.error('Failed to load scan history');
    }
  };

  const handleDownloadReport = (scanId: string, format: 'json' | 'html') => {
    toast.success(`Downloading ${format.toUpperCase()} report for scan ${scanId}`);
    // In a real app, this would trigger a file download
  };

  // Filter scans based on search query and date filter
  const filteredScans = scans.filter(scan => {
    const matchesSearch = searchQuery === '' || 
      scan.folder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = dateFilter === '' || scan.date.includes(dateFilter);
    
    return matchesSearch && matchesDate;
  });

  return (
    <ScanarrLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-semibold">Scan History</h2>
          <div className="text-sm text-muted-foreground">
            Showing {filteredScans.length} of {scans.length} scans
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search by folder or scan ID..."
              className="scanarr-input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="date"
              className="scanarr-input pl-10"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Scans Table */}
        <div className="overflow-x-auto">
          <table className="scanarr-table">
            <thead>
              <tr>
                <th>Scan ID</th>
                <th>Date</th>
                <th>Folder</th>
                <th>Files Checked</th>
                <th>Problem Files</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => (
                  <tr key={scan.id}>
                    <td>{scan.id}</td>
                    <td>{scan.date}</td>
                    <td>{scan.folder}</td>
                    <td>{scan.filesChecked}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-xs ${scan.problemFiles > 0 ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'}`}>
                        {scan.problemFiles}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownloadReport(scan.id, 'json')}
                          className="p-1 text-primary hover:text-primary/80"
                          title="Download JSON Report"
                        >
                          <FileDown size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(scan.id, 'html')}
                          className="p-1 text-primary hover:text-primary/80"
                          title="Download HTML Report"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No scans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ScanarrLayout>
  );
};

export default History;
