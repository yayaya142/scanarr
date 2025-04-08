
import React, { useState } from 'react';
import { toast } from "sonner";
import { Folder, Clock, Filter, AlertTriangle, Settings as SettingsIcon, SendIcon, Save, X } from 'lucide-react';
import ScanarrLayout from '@/components/ScanarrLayout';

interface FolderPath {
  id: string;
  path: string;
}

interface CustomRule {
  id: string;
  keyword: string;
}

const Settings: React.FC = () => {
  const [folderPaths, setFolderPaths] = useState<FolderPath[]>([
    { id: '1', path: '/media/movies' },
    { id: '2', path: '/media/tv' }
  ]);
  
  const [scanFrequency, setScanFrequency] = useState(24);
  
  const [customRules, setCustomRules] = useState<CustomRule[]>([
    { id: '1', keyword: 'x265' },
    { id: '2', keyword: '10bit' },
    { id: '3', keyword: 'hevc' }
  ]);
  
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: '',
    chatId: '',
    notifications: {
      onScanCompleted: true,
      onProblematicFilesFound: true,
      onThresholdExceeded: true,
      onCustomRuleTriggered: false,
      onScanFailure: true
    },
    thresholdCount: 5
  });

  // Add a new empty folder path
  const addFolderPath = () => {
    const newFolderPath: FolderPath = {
      id: `folder-${Date.now()}`,
      path: ''
    };
    setFolderPaths([...folderPaths, newFolderPath]);
  };

  // Remove a folder path
  const removeFolderPath = (id: string) => {
    setFolderPaths(folderPaths.filter(folder => folder.id !== id));
  };

  // Update a folder path
  const updateFolderPath = (id: string, newPath: string) => {
    setFolderPaths(folderPaths.map(folder => 
      folder.id === id ? { ...folder, path: newPath } : folder
    ));
  };

  // Add a new custom rule
  const addCustomRule = () => {
    const newRule: CustomRule = {
      id: `rule-${Date.now()}`,
      keyword: ''
    };
    setCustomRules([...customRules, newRule]);
  };

  // Remove a custom rule
  const removeCustomRule = (id: string) => {
    setCustomRules(customRules.filter(rule => rule.id !== id));
  };

  // Update a custom rule
  const updateCustomRule = (id: string, newKeyword: string) => {
    setCustomRules(customRules.map(rule => 
      rule.id === id ? { ...rule, keyword: newKeyword } : rule
    ));
  };

  // Update notification settings
  const updateNotificationSetting = (key: keyof typeof telegramSettings.notifications, value: boolean) => {
    setTelegramSettings({
      ...telegramSettings,
      notifications: {
        ...telegramSettings.notifications,
        [key]: value
      }
    });
  };

  // Save all settings
  const saveSettings = () => {
    // Validate folder paths
    const emptyPaths = folderPaths.some(folder => folder.path.trim() === '');
    if (emptyPaths) {
      toast.error('All folder paths must be filled in');
      return;
    }

    // Validate custom rules
    const emptyRules = customRules.some(rule => rule.keyword.trim() === '');
    if (emptyRules) {
      toast.error('All custom rules must have a keyword');
      return;
    }

    // Validate Telegram settings if provided
    const hasTelegramConfig = telegramSettings.botToken.trim() !== '' || telegramSettings.chatId.trim() !== '';
    if (hasTelegramConfig) {
      if (telegramSettings.botToken.trim() === '' || telegramSettings.chatId.trim() === '') {
        toast.error('Both Bot Token and Chat ID are required for Telegram notifications');
        return;
      }
    }

    // In a real app, we would save to a database or configuration file
    toast.success('Settings saved successfully');
  };

  // Test Telegram notifications
  const testTelegramNotifications = () => {
    if (telegramSettings.botToken.trim() === '' || telegramSettings.chatId.trim() === '') {
      toast.error('Both Bot Token and Chat ID are required');
      return;
    }

    // In a real app, we would send a test message to the Telegram bot
    toast.success('Test notification sent to Telegram');
  };

  return (
    <ScanarrLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <button 
            className="scanarr-btn scanarr-btn-success flex items-center space-x-2"
            onClick={saveSettings}
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Scan Folders */}
        <div className="scanarr-card">
          <div className="flex items-center space-x-3 mb-4">
            <Folder className="text-primary" />
            <h3 className="text-lg font-medium">Scan Folders</h3>
          </div>
          
          <div className="space-y-3">
            {folderPaths.map((folder) => (
              <div key={folder.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={folder.path}
                  onChange={(e) => updateFolderPath(folder.id, e.target.value)}
                  placeholder="/path/to/media"
                  className="scanarr-input"
                />
                <button
                  onClick={() => removeFolderPath(folder.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            
            <button
              onClick={addFolderPath}
              className="scanarr-btn scanarr-btn-primary"
            >
              Add Folder
            </button>
          </div>
        </div>

        {/* Scan Frequency */}
        <div className="scanarr-card">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="text-primary" />
            <h3 className="text-lg font-medium">Automatic Scan Frequency</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="168"
              value={scanFrequency}
              onChange={(e) => setScanFrequency(parseInt(e.target.value))}
              className="scanarr-input w-24"
            />
            <span>hours</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            The system will automatically scan your media folders at this interval.
          </p>
        </div>

        {/* Detection Rules */}
        <div className="scanarr-card">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="text-primary" />
            <h3 className="text-lg font-medium">Detection Rules</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">System Rules (Non-editable)</h4>
              <div className="space-y-2">
                <div className="p-3 bg-secondary rounded">
                  <p className="text-sm">If video codec is H.264 with High10 profile → mark as problematic</p>
                </div>
                <div className="p-3 bg-secondary rounded">
                  <p className="text-sm">If color bit depth > 8bit → mark as problematic</p>
                </div>
                <div className="p-3 bg-secondary rounded">
                  <p className="text-sm">If audio codec is DTS or EAC3 → mark as problematic</p>
                </div>
                <div className="p-3 bg-secondary rounded">
                  <p className="text-sm">If no embedded subtitles → mark as problematic</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Custom Rules</h4>
              <div className="space-y-3">
                {customRules.map((rule) => (
                  <div key={rule.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={rule.keyword}
                      onChange={(e) => updateCustomRule(rule.id, e.target.value)}
                      placeholder="Enter keyword (e.g., x265, 10bit)"
                      className="scanarr-input"
                    />
                    <button
                      onClick={() => removeCustomRule(rule.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addCustomRule}
                  className="scanarr-btn scanarr-btn-primary"
                >
                  Add Rule
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Files containing these keywords in their metadata will be flagged as problematic.
              </p>
            </div>
          </div>
        </div>

        {/* Telegram Notifications */}
        <div className="scanarr-card">
          <div className="flex items-center space-x-3 mb-4">
            <SendIcon className="text-primary" />
            <h3 className="text-lg font-medium">Telegram Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="scanarr-label">Bot Token</label>
                <input
                  type="text"
                  value={telegramSettings.botToken}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botToken: e.target.value })}
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  className="scanarr-input"
                />
              </div>
              
              <div>
                <label className="scanarr-label">Chat ID</label>
                <input
                  type="text"
                  value={telegramSettings.chatId}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, chatId: e.target.value })}
                  placeholder="-1001234567890"
                  className="scanarr-input"
                />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Notification Triggers</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onScanCompleted"
                    checked={telegramSettings.notifications.onScanCompleted}
                    onChange={(e) => updateNotificationSetting('onScanCompleted', e.target.checked)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="onScanCompleted" className="text-sm">On scan completed</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onProblematicFilesFound"
                    checked={telegramSettings.notifications.onProblematicFilesFound}
                    onChange={(e) => updateNotificationSetting('onProblematicFilesFound', e.target.checked)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="onProblematicFilesFound" className="text-sm">When problematic files are found</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onThresholdExceeded"
                    checked={telegramSettings.notifications.onThresholdExceeded}
                    onChange={(e) => updateNotificationSetting('onThresholdExceeded', e.target.checked)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="onThresholdExceeded" className="text-sm">
                    When number of problematic files exceeds
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={telegramSettings.thresholdCount}
                      onChange={(e) => setTelegramSettings({ ...telegramSettings, thresholdCount: parseInt(e.target.value) })}
                      className="mx-2 w-16 px-2 py-0.5 scanarr-input"
                    />
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onCustomRuleTriggered"
                    checked={telegramSettings.notifications.onCustomRuleTriggered}
                    onChange={(e) => updateNotificationSetting('onCustomRuleTriggered', e.target.checked)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="onCustomRuleTriggered" className="text-sm">When a custom rule is triggered</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onScanFailure"
                    checked={telegramSettings.notifications.onScanFailure}
                    onChange={(e) => updateNotificationSetting('onScanFailure', e.target.checked)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="onScanFailure" className="text-sm">On scan failure</label>
                </div>
              </div>
            </div>
            
            <button
              onClick={testTelegramNotifications}
              className="scanarr-btn scanarr-btn-primary"
            >
              Test Notifications
            </button>
          </div>
        </div>
      </div>
    </ScanarrLayout>
  );
};

export default Settings;
