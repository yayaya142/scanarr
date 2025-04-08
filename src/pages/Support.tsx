
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScanarrLayout from '@/components/ScanarrLayout';
import { HelpCircle, FileText, Terminal, AlertCircle } from 'lucide-react';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');

  const faqItems = [
    {
      question: "What file formats does Scanarr support?",
      answer: "Scanarr supports most common video formats including MKV, MP4, AVI, and MOV files. It can analyze any video file that can be processed by FFmpeg."
    },
    {
      question: "Why are H.264 High10 files marked as problematic?",
      answer: "H.264 High10 profile files often have compatibility issues with certain devices, particularly older or less powerful hardware that may struggle with 10-bit color depth decoding."
    },
    {
      question: "Can I exclude certain folders from scans?",
      answer: "Currently, Scanarr will scan all folders specified in the Settings page. To exclude a folder, remove it from the scan folders list. In a future update, we plan to add a specific exclusion list feature."
    },
    {
      question: "Does Scanarr modify my files?",
      answer: "No, Scanarr is a read-only tool. It analyzes your media files without making any changes to them. It only reports potential issues and doesn't perform any automatic fixes."
    },
    {
      question: "How can I customize which issues are reported?",
      answer: "You can add custom rules in the Settings page to flag files containing specific keywords in their metadata. The built-in system rules cannot be modified, but you can ignore their results in your workflow."
    },
    {
      question: "How frequently should I run scans?",
      answer: "We recommend setting the scan frequency based on how often you add new media. For active libraries, daily scans (24 hours) work well. For less active libraries, weekly scans may be sufficient."
    },
    {
      question: "Can I run Scanarr without Docker?",
      answer: "While Docker is the recommended deployment method, you can run Scanarr directly if you install all dependencies (Node.js, FFmpeg) on your system. See the Installation section for details."
    },
    {
      question: "Will Scanarr work with my Plex/Jellyfin/Emby library?",
      answer: "Yes, Scanarr can scan any media library by pointing it to your media folders. It doesn't directly integrate with media servers but works alongside them by analyzing the same files."
    },
    {
      question: "How resource-intensive are scans?",
      answer: "Scanarr is designed to be lightweight, but scan resource usage depends on your library size. Large libraries may cause higher CPU usage during scans. You can schedule scans during off-peak hours to minimize impact."
    },
    {
      question: "Is there a limit to how many files Scanarr can analyze?",
      answer: "There's no hard limit on the number of files Scanarr can analyze. Performance may degrade with extremely large libraries (100,000+ files). For best results with large libraries, consider organizing your scan folders into smaller sub-sections."
    }
  ];

  return (
    <ScanarrLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Support</h2>

        <div className="scanarr-card space-y-6">
          <div className="flex space-x-4 border-b border-border">
            <button
              className={`pb-2 px-1 font-medium ${activeTab === 'faq' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('faq')}
            >
              FAQ
            </button>
            <button
              className={`pb-2 px-1 font-medium ${activeTab === 'installation' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('installation')}
            >
              Installation
            </button>
            <button
              className={`pb-2 px-1 font-medium ${activeTab === 'troubleshooting' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('troubleshooting')}
            >
              Troubleshooting
            </button>
          </div>

          {activeTab === 'faq' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-4">
                <HelpCircle className="text-primary" />
                <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {activeTab === 'installation' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="text-primary" />
                <h3 className="text-lg font-medium">Installation Guide</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Docker Installation (Recommended)</h4>
                  <div className="bg-secondary p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>
{`# Create a docker-compose.yml file with these contents:
version: '3'

services:
  scanarr:
    image: scanarr/scanarr:latest
    container_name: scanarr
    ports:
      - "8080:8080"
    volumes:
      - ./config:/config
      - /path/to/media:/media
    restart: unless-stopped

# Then run:
docker-compose up -d`}
                      </code>
                    </pre>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Replace '/path/to/media' with your actual media folders. Multiple media locations can be added as additional volume mounts.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Environment Variables</h4>
                  <table className="w-full text-sm">
                    <thead className="text-left border-b border-border">
                      <tr>
                        <th className="pb-2">Variable</th>
                        <th className="pb-2">Description</th>
                        <th className="pb-2">Default</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-2 font-mono">TZ</td>
                        <td>Timezone</td>
                        <td>UTC</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">PUID</td>
                        <td>User ID for file permissions</td>
                        <td>1000</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">PGID</td>
                        <td>Group ID for file permissions</td>
                        <td>1000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Manual Installation</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you prefer not to use Docker, you can install Scanarr manually.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Prerequisites:</p>
                    <ul className="text-sm list-disc ml-5 text-muted-foreground">
                      <li>Node.js 16 or later</li>
                      <li>FFmpeg properly installed and available in PATH</li>
                    </ul>
                  </div>
                  <div className="bg-secondary p-4 rounded-md mt-3">
                    <pre className="text-sm overflow-x-auto">
                      <code>
{`# Clone repository
git clone https://github.com/scanarr/scanarr.git
cd scanarr

# Install dependencies
npm install

# Build the application
npm run build

# Start the server
npm start`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'troubleshooting' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="text-primary" />
                <h3 className="text-lg font-medium">Troubleshooting</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Common Issues</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-md">
                      <p className="font-medium">Unable to access media files</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check that your Docker volumes are correctly mapped. The container needs read access to all media locations.
                      </p>
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Solution:</p>
                        <p className="text-muted-foreground">
                          Ensure the correct paths are specified in your docker-compose.yml file and that the PUID/PGID match the owner of your media files.
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-border rounded-md">
                      <p className="font-medium">Telegram notifications not working</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        If you've set up Telegram but aren't receiving messages, check your Bot Token and Chat ID.
                      </p>
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Solution:</p>
                        <p className="text-muted-foreground">
                          Verify your Bot Token and Chat ID are correct. Ensure your bot has permission to send messages to the specified chat. Use the "Test Notifications" button to check connectivity.
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-border rounded-md">
                      <p className="font-medium">Scans taking too long</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Large libraries can cause scans to take a long time.
                      </p>
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Solution:</p>
                        <p className="text-muted-foreground">
                          Consider splitting your library into smaller sections and scanning them separately. Ensure your host has sufficient resources (CPU/RAM) for the size of your library.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Logs</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Logs can help diagnose issues with Scanarr.
                  </p>
                  <div className="bg-secondary p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      <code>
{`# View logs via Docker
docker logs scanarr

# Or if using docker-compose
docker-compose logs scanarr

# Logs are also stored in:
/config/logs/`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScanarrLayout>
  );
};

export default Support;
