
import React, { useState, useEffect } from 'react';
import { Folder, ChevronRight, ChevronUp, Home, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FolderPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialPath?: string;
}

// Mock filesystem structure - in a real app, this would come from a backend API
const mockFileSystem = {
  '/': {
    type: 'dir',
    children: ['media', 'mnt', 'config', 'var', 'etc']
  },
  '/media': {
    type: 'dir',
    children: ['movies', 'tv', 'music']
  },
  '/media/movies': {
    type: 'dir',
    children: ['action', 'comedy', 'drama']
  },
  '/media/tv': {
    type: 'dir',
    children: ['series1', 'series2', 'documentaries']
  },
  '/mnt': {
    type: 'dir',
    children: ['nas1', 'nas2', 'external']
  },
  '/mnt/nas1': {
    type: 'dir',
    children: ['shared', 'backup']
  },
  '/mnt/nas1/shared': {
    type: 'dir',
    children: ['media', 'downloads']
  },
  '/mnt/nas1/shared/media': {
    type: 'dir',
    children: ['movies', 'tv']
  },
};

const FolderPicker: React.FC<FolderPickerProps> = ({ open, onClose, onSelect, initialPath = '/' }) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [showHidden, setShowHidden] = useState(false);
  const [manualPath, setManualPath] = useState('');

  // Set initial path when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentPath(initialPath || '/');
      setManualPath(initialPath || '/');
    }
  }, [open, initialPath]);

  const getFolderContents = (path: string): string[] => {
    // In a real app, this would fetch data from the backend
    return mockFileSystem[path]?.children || [];
  };

  const isPathValid = (path: string): boolean => {
    // In a real app, this would validate via the backend
    return !!mockFileSystem[path];
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setManualPath(path);
  };

  const handleSelect = () => {
    if (isPathValid(manualPath)) {
      onSelect(manualPath);
      onClose();
    } else if (isPathValid(currentPath)) {
      onSelect(currentPath);
      onClose();
    }
  };

  const renderFolder = (folderPath: string, depth = 0) => {
    const isExpanded = expandedFolders[folderPath];
    const folderName = folderPath.split('/').filter(Boolean).pop() || '/';
    const children = isExpanded ? getFolderContents(folderPath) : [];
    
    return (
      <div key={folderPath} style={{ marginLeft: `${depth * 16}px` }}>
        <div 
          className={`flex items-center p-1 hover:bg-accent rounded cursor-pointer ${currentPath === folderPath ? 'bg-accent' : ''}`}
          onClick={() => {
            navigateTo(folderPath);
            toggleFolder(folderPath);
          }}
        >
          {children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folderPath);
              }}
              className="mr-1 p-1 hover:bg-muted rounded"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-6"></span>
          )}
          
          {folderPath === '/' ? (
            <Home className="mr-2 h-4 w-4 text-primary" />
          ) : isExpanded ? (
            <FolderOpen className="mr-2 h-4 w-4 text-primary" />
          ) : (
            <Folder className="mr-2 h-4 w-4 text-primary" />
          )}
          
          <span className="text-sm">{folderName}</span>
        </div>
        
        {isExpanded && (
          <div>
            {children.map(child => {
              const childPath = folderPath === '/' ? `/${child}` : `${folderPath}/${child}`;
              return renderFolder(childPath, depth + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  const renderBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    
    return (
      <div className="flex items-center text-sm space-x-1 mb-2 overflow-x-auto pb-2">
        <span 
          className="cursor-pointer hover:underline flex items-center"
          onClick={() => navigateTo('/')}
        >
          <Home size={14} className="mr-1" /> root
        </span>
        
        {parts.map((part, index) => {
          const path = '/' + parts.slice(0, index + 1).join('/');
          return (
            <React.Fragment key={path}>
              <ChevronRight size={14} />
              <span 
                className="cursor-pointer hover:underline"
                onClick={() => navigateTo(path)}
              >
                {part}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Folder</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="flex items-center space-x-2 px-1">
            <input
              type="text"
              value={manualPath}
              onChange={(e) => setManualPath(e.target.value)}
              className="flex-1 scanarr-input"
              placeholder="/path/to/folder"
            />
            <Button 
              variant="outline" 
              onClick={() => {
                if (isPathValid(manualPath)) {
                  navigateTo(manualPath);
                }
              }}
            >
              Go
            </Button>
          </div>
          
          {renderBreadcrumbs()}
          
          <ScrollArea className="h-[300px] border rounded-md p-2">
            <div className="space-y-1">
              {renderFolder('/')}
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showHidden" 
              checked={showHidden}
              onCheckedChange={(checked) => setShowHidden(!!checked)}
            />
            <label htmlFor="showHidden" className="text-sm">Show hidden folders</label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSelect}>Select Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FolderPicker;
