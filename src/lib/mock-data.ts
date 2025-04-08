
import { format, subDays } from 'date-fns';

// Types
export interface Scan {
  id: string;
  date: string;
  filesChecked: number;
  problemFiles: number;
  folder: string;
}

export interface ProblemFile {
  id: string;
  scanId: string;
  path: string;
  filename: string;
  issues: string[];
  metadata: {
    codec: string;
    bitDepth: number;
    audioCodec: string;
    hasSubtitles: boolean;
    resolution: string;
    size: string;
  };
}

export interface ScanStatistics {
  totalScans: number;
  totalProblemFiles: number;
  lastScanDate: string | null;
  lastScanId: string | null;
}

// Generate random scans for the past 90 days
const generateRandomScans = (count: number): Scan[] => {
  const scans: Scan[] = [];
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const filesChecked = Math.floor(Math.random() * 1000) + 50;
    const problemFiles = Math.floor(Math.random() * 20);
    
    scans.push({
      id: `scan-${i}`,
      date: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd HH:mm:ss'),
      filesChecked,
      problemFiles,
      folder: `/media/library${Math.floor(Math.random() * 3) + 1}`,
    });
  }
  
  // Sort by date descending
  return scans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate problem files for each scan
const generateProblemFiles = (scans: Scan[]): ProblemFile[] => {
  const problemFiles: ProblemFile[] = [];
  const codecs = ['H.264', 'H.265', 'HEVC', 'AV1', 'VP9'];
  const audioCodecs = ['AAC', 'AC3', 'DTS', 'EAC3', 'FLAC', 'MP3'];
  const resolutions = ['1080p', '720p', '4K', '2160p', 'SD'];
  
  scans.forEach(scan => {
    const fileCount = scan.problemFiles;
    
    for (let i = 0; i < fileCount; i++) {
      const hasSubtitles = Math.random() > 0.5;
      const bitDepth = Math.random() > 0.7 ? 10 : 8;
      const codec = codecs[Math.floor(Math.random() * codecs.length)];
      const audioCodec = audioCodecs[Math.floor(Math.random() * audioCodecs.length)];
      const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
      
      const issues: string[] = [];
      
      if (codec === 'H.264' && bitDepth > 8) {
        issues.push('H.264 with High10 profile');
      }
      
      if (bitDepth > 8) {
        issues.push('Color bit depth > 8bit');
      }
      
      if (audioCodec === 'DTS' || audioCodec === 'EAC3') {
        issues.push(`Audio codec is ${audioCodec}`);
      }
      
      if (!hasSubtitles) {
        issues.push('No embedded subtitles');
      }
      
      if (codec === 'HEVC' || codec === 'H.265') {
        issues.push('File contains HEVC content');
      }
      
      const fileSize = (Math.random() * 10).toFixed(2) + ' GB';
      const fileNames = [
        "Interstellar.2014",
        "The.Matrix.1999",
        "Inception.2010",
        "Avengers.Endgame.2019",
        "Breaking.Bad.S01E01",
        "Game.of.Thrones.S08E06",
        "Stranger.Things.S04E01",
        "The.Witcher.S01E05",
      ];
      
      const fileName = `${fileNames[Math.floor(Math.random() * fileNames.length)]}.${resolution}.${codec}.${bitDepth}bit.${audioCodec}${hasSubtitles ? '.with.subs' : ''}.mkv`;
      
      problemFiles.push({
        id: `file-${scan.id}-${i}`,
        scanId: scan.id,
        path: `${scan.folder}/Movies/`,
        filename: fileName,
        issues,
        metadata: {
          codec,
          bitDepth,
          audioCodec,
          hasSubtitles,
          resolution,
          size: fileSize
        }
      });
    }
  });
  
  return problemFiles;
};

// Mock data
const mockScans = generateRandomScans(50);
const mockProblemFiles = generateProblemFiles(mockScans);

// Calculate scan statistics
const calculateStatistics = (): ScanStatistics => {
  const latestScan = mockScans.length > 0 ? mockScans[0] : null;
  
  return {
    totalScans: mockScans.length,
    totalProblemFiles: mockProblemFiles.length,
    lastScanDate: latestScan ? latestScan.date : null,
    lastScanId: latestScan ? latestScan.id : null
  };
};

// Mock API functions
export const getScans = (): Promise<Scan[]> => {
  return Promise.resolve(mockScans);
};

export const getScanById = (id: string): Promise<Scan | undefined> => {
  return Promise.resolve(mockScans.find(scan => scan.id === id));
};

export const getProblemFilesByScanId = (scanId: string): Promise<ProblemFile[]> => {
  return Promise.resolve(mockProblemFiles.filter(file => file.scanId === scanId));
};

export const getAllProblemFiles = (): Promise<ProblemFile[]> => {
  return Promise.resolve(mockProblemFiles);
};

export const getStatistics = (): Promise<ScanStatistics> => {
  return Promise.resolve(calculateStatistics());
};

export const triggerNewScan = (): Promise<Scan> => {
  // Simulate a new scan
  const newScan: Scan = {
    id: `scan-${mockScans.length}`,
    date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    filesChecked: Math.floor(Math.random() * 1000) + 50,
    problemFiles: Math.floor(Math.random() * 10),
    folder: '/media/library/all',
  };
  
  // In a real app, we'd add this to the database
  mockScans.unshift(newScan);
  
  // Generate problem files for this scan
  const newProblemFiles = generateProblemFiles([newScan]);
  // Add to our problem files array
  mockProblemFiles.push(...newProblemFiles);
  
  return Promise.resolve(newScan);
};

// Get daily scan counts for the chart
export const getDailyScanCounts = (): Promise<{date: string; count: number}[]> => {
  const counts: {[key: string]: number} = {};
  
  // Group scans by date
  mockScans.forEach(scan => {
    const date = scan.date.split(' ')[0]; // Get just the date part
    counts[date] = (counts[date] || 0) + 1;
  });
  
  // Convert to array of objects
  const result = Object.entries(counts).map(([date, count]) => ({
    date,
    count
  }));
  
  // Sort by date
  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Only return the last 90 days
  return Promise.resolve(result.slice(-90));
};
