
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Clock, Search, Download, FileText, AlertCircle } from 'lucide-react';
import ScanarrLayout from '@/components/ScanarrLayout';
import { getScans, Scan } from '@/lib/mock-data';
import { Checkbox } from "@/components/ui/checkbox";

const History: React.FC = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [filteredScans, setFilteredScans] = useState<Scan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null
  });
  const [showEmptyScans, setShowEmptyScans] = useState(false);

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    // Filter scans based on search query and date range
    let filtered = [...scans];
    
    // Filter out empty scans if showEmptyScans is false
    if (!showEmptyScans) {
      filtered = filtered.filter(scan => scan.problemFiles > 0);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(scan => 
        scan.id.toLowerCase().includes(query) || 
        scan.folder.toLowerCase().includes(query)
      );
    }
    
    // Filter by date range
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(scan => {
        const scanDate = new Date(scan.date);
        return scanDate >= startDate;
      });
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(scan => {
        const scanDate = new Date(scan.date);
        return scanDate <= endDate;
      });
    }
    
    setFilteredScans(filtered);
  }, [scans, searchQuery, dateRange, showEmptyScans]);

  const loadScans = async () => {
    try {
      const data = await getScans();
      setScans(data);
      setFilteredScans(data.filter(scan => scan.problemFiles > 0));
    } catch (error) {
      console.error('Error loading scans:', error);
      toast.error('Failed to load scan history');
    }
  };

  const handleDownloadReport = (scanId: string, format: 'json' | 'html') => {
    // In a real implementation, this would call an API endpoint
    const scan = scans.find(s => s.id === scanId);
    
    if (!scan) {
      toast.error('Scan not found');
      return;
    }
    
    if (scan.problemFiles === 0) {
      toast.warning('No problematic files in this scan to download');
      return;
    }
    
    console.log(`Downloading ${format.toUpperCase()} report for scan ${scanId}`);
    
    // Simulate a download
    setTimeout(() => {
      toast.success(`${format.toUpperCase()} report downloaded successfully`);
    }, 800);
    
    // In a real app, this would trigger a file download from the server
    // e.g., window.location.href = `/api/reports/${scanId}/download?format=${format}`;
  };

  return (
    <ScanarrLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Scan History</h2>
        </div>

        {/* Search and Filters */}
        <div className="scanarr-card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="relative w-full md:w-auto md:flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search by scan ID or folder..."
                className="scanarr-input pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-3">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <label className="text-sm whitespace-nowrap">Date Range:</label>
                <input
                  type="date"
                  className="scanarr-input"
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
                />
                <span className="text-center">to</span>
                <input
                  type="date"
                  className="scanarr-input"
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <Checkbox
              id="showEmptyScans"
              checked={showEmptyScans}
              onCheckedChange={(checked) => setShowEmptyScans(!!checked)}
            />
            <label htmlFor="showEmptyScans" className="text-sm ml-2">
              Show scans with no problematic files
            </label>
          </div>
        </div>

        {/* Scans Table */}
        <div className="scanarr-card">
          {filteredScans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 pl-3">Date & Time</th>
                    <th className="text-left pb-3">Scan ID</th>
                    <th className="text-left pb-3">Folder</th>
                    <th className="text-right pb-3">Files Checked</th>
                    <th className="text-right pb-3">Problem Files</th>
                    <th className="text-right pb-3 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScans.map((scan) => (
                    <tr key={scan.id} className="border-b border-border">
                      <td className="py-3 pl-3">
                        <div className="flex items-center">
                          <Clock className="text-primary mr-2 h-4 w-4" />
                          <span>{scan.date}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-sm">{scan.id}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm truncate max-w-[200px] inline-block">{scan.folder}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span>{scan.filesChecked.toLocaleString()}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={scan.problemFiles > 0 ? 'text-destructive font-medium' : ''}>
                          {scan.problemFiles.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex justify-end space-x-2">
                          {scan.problemFiles > 0 ? (
                            <>
                              <button
                                onClick={() => handleDownloadReport(scan.id, 'json')}
                                className="p-1 hover:bg-accent rounded"
                                title="Download JSON Report"
                              >
                                <FileText className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadReport(scan.id, 'html')}
                                className="p-1 hover:bg-accent rounded"
                                title="Download HTML Report"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No issues found</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No Scan History Found</h3>
              {searchQuery || dateRange.start || dateRange.end ? (
                <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
              ) : !showEmptyScans ? (
                <p className="text-muted-foreground mt-1">No scans with problematic files. Try enabling "Show scans with no problematic files".</p>
              ) : (
                <p className="text-muted-foreground mt-1">No scans have been performed yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </ScanarrLayout>
  );
};

export default History;
