
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { File, Download, FileWarning, Search, Filter } from 'lucide-react';
import ScanarrLayout from '@/components/ScanarrLayout';
import { getAllProblemFiles, getScans, ProblemFile, Scan } from '@/lib/mock-data';

const Reports: React.FC = () => {
  const [problemFiles, setProblemFiles] = useState<ProblemFile[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [files, scansData] = await Promise.all([
        getAllProblemFiles(),
        getScans()
      ]);
      
      setProblemFiles(files);
      setScans(scansData);
    } catch (error) {
      console.error('Error loading problem files:', error);
      toast.error('Failed to load problem files');
    }
  };

  // Filter problem files based on selected scan and search query
  const filteredFiles = problemFiles.filter(file => {
    const matchesScan = selectedScanId === 'all' || file.scanId === selectedScanId;
    
    const matchesSearch = searchQuery === '' || 
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.filename.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesScan && matchesSearch;
  });

  // Get the scan date for the selected scan
  const selectedScanDate = selectedScanId === 'all' 
    ? 'All Scans' 
    : scans.find(scan => scan.id === selectedScanId)?.date || 'Unknown Date';

  const handleDownloadReport = () => {
    toast.success('Downloading full report');
    // In a real app, this would download a comprehensive report
  };

  return (
    <ScanarrLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-semibold">Problem Reports</h2>
          <button 
            className="scanarr-btn scanarr-btn-primary flex items-center space-x-2"
            onClick={handleDownloadReport}
          >
            <Download size={16} />
            <span>Download Full Report</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search by filename or path..."
              className="scanarr-input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select
              className="scanarr-input pl-10 appearance-none"
              value={selectedScanId}
              onChange={(e) => setSelectedScanId(e.target.value)}
            >
              <option value="all">All Scans</option>
              {scans.map((scan) => (
                <option key={scan.id} value={scan.id}>
                  {scan.date} - {scan.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info panel */}
        <div className="scanarr-card bg-secondary">
          <div className="flex items-center space-x-3">
            <FileWarning className="text-primary" />
            <div>
              <p className="font-medium">Showing problem files from: {selectedScanDate}</p>
              <p className="text-sm text-muted-foreground">Total: {filteredFiles.length} problem files</p>
            </div>
          </div>
        </div>

        {/* Problem Files List */}
        <div className="space-y-4">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div key={file.id} className="scanarr-card">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-2 md:space-y-0">
                  <div className="flex items-start space-x-3">
                    <File className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">{file.filename}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-lg">{file.path + file.filename}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-2 py-1 bg-secondary rounded text-xs">
                      Scan: {file.scanId}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Issues:</h4>
                  <div className="space-y-1">
                    {file.issues.map((issue, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-destructive"></div>
                        <p className="text-sm">{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-2">File Metadata:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Codec:</span> {file.metadata.codec}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Bit Depth:</span> {file.metadata.bitDepth}bit
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Audio:</span> {file.metadata.audioCodec}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Subtitles:</span> {file.metadata.hasSubtitles ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Resolution:</span> {file.metadata.resolution}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Size:</span> {file.metadata.size}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="scanarr-card p-8 text-center">
              <FileWarning className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Problem Files Found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery ? 'Try adjusting your search query' : 'All your files are in good condition'}
              </p>
            </div>
          )}
        </div>
      </div>
    </ScanarrLayout>
  );
};

export default Reports;
