
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Terminal, Database, AlertTriangle } from 'lucide-react';
import ScanarrLayout from '@/components/ScanarrLayout';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const Support: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'How do I install Scanarr using Docker?',
      answer: (
        <div className="space-y-2">
          <p>You can install Scanarr using Docker with the following command:</p>
          <div className="bg-secondary p-3 rounded-md overflow-x-auto">
            <pre className="text-sm">
              <code>
                docker run -d \<br />
                --name=scanarr \<br />
                -p 8080:8080 \<br />
                -v /path/to/config:/config \<br />
                -v /path/to/media:/media \<br />
                --restart unless-stopped \<br />
                scanarr/scanarr:latest
              </code>
            </pre>
          </div>
          <p>Or using docker-compose:</p>
          <div className="bg-secondary p-3 rounded-md overflow-x-auto">
            <pre className="text-sm">
              <code>
                version: '3'<br />
                services:<br />
                &nbsp;&nbsp;scanarr:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;image: scanarr/scanarr:latest<br />
                &nbsp;&nbsp;&nbsp;&nbsp;container_name: scanarr<br />
                &nbsp;&nbsp;&nbsp;&nbsp;ports:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 8080:8080<br />
                &nbsp;&nbsp;&nbsp;&nbsp;volumes:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- /path/to/config:/config<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- /path/to/media:/media<br />
                &nbsp;&nbsp;&nbsp;&nbsp;restart: unless-stopped
              </code>
            </pre>
          </div>
        </div>
      )
    },
    {
      question: 'Where is the data stored?',
      answer: (
        <div>
          <p>Scanarr stores all its data in the following locations inside the Docker container:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>/config/scanarr.db</strong> - SQLite database containing all scan history and settings</li>
            <li><strong>/reports/</strong> - Folder containing all generated reports organized by scan ID</li>
          </ul>
          <p className="mt-2">When mapping volumes in Docker, make sure to map these locations to persist your data.</p>
        </div>
      )
    },
    {
      question: 'How often should I schedule scans?',
      answer: (
        <div>
          <p>The optimal scan frequency depends on how often your media library changes:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Frequent changes (daily):</strong> Every 12-24 hours</li>
            <li><strong>Moderate changes (weekly):</strong> Every 24-48 hours</li>
            <li><strong>Occasional changes:</strong> Every 72 hours or weekly</li>
          </ul>
          <p className="mt-2">Remember that scans will consume CPU resources, so schedule accordingly.</p>
        </div>
      )
    },
    {
      question: 'Why are certain files flagged as problematic?',
      answer: (
        <div>
          <p>Files are flagged as problematic based on these criteria:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>H.264 with High10 profile:</strong> This profile requires more processing power to decode.</li>
            <li><strong>Color bit depth > 8bit:</strong> Higher bit depths require more compatible hardware for playback.</li>
            <li><strong>DTS or EAC3 audio:</strong> These audio codecs may not be supported on all devices.</li>
            <li><strong>No embedded subtitles:</strong> Files without subtitles may be less accessible.</li>
            <li><strong>Custom keywords:</strong> Any files matching your custom rules will also be flagged.</li>
          </ul>
        </div>
      )
    },
    {
      question: 'How do I set up Telegram notifications?',
      answer: (
        <div className="space-y-2">
          <p>To set up Telegram notifications:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create a Telegram bot by messaging @BotFather on Telegram</li>
            <li>Copy the API token provided by BotFather</li>
            <li>Add your bot to a group or start a private conversation with it</li>
            <li>Get your Chat ID (use @getidsbot or other methods)</li>
            <li>Enter these details in Scanarr's Settings page</li>
            <li>Configure notification triggers according to your preferences</li>
            <li>Click "Test Notifications" to verify your setup</li>
          </ol>
        </div>
      )
    },
    {
      question: 'Can I add custom rules for detecting problematic files?',
      answer: (
        <div>
          <p>Yes, Scanarr allows you to define custom keywords that will flag files as problematic when found in the metadata.</p>
          <p className="mt-2">Some examples of useful keywords:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>x265, HEVC, h.265</strong> - For detecting HEVC-encoded content</li>
            <li><strong>10bit, 12bit</strong> - For high bit depth content</li>
            <li><strong>HDR, HDR10, HDR10+, Dolby Vision</strong> - For HDR formats</li>
            <li><strong>opus, vorbis</strong> - For less common audio codecs</li>
          </ul>
          <p className="mt-2">Add these in the Settings → Detection Rules → Custom Rules section.</p>
        </div>
      )
    },
    {
      question: 'How long is scan history kept?',
      answer: (
        <p>Scanarr automatically deletes scan history and associated reports after 90 days to conserve storage space. If you need to retain data for longer periods, consider backing up the SQLite database and report files.</p>
      )
    },
    {
      question: 'Is there a way to exclude certain folders from scans?',
      answer: (
        <p>Currently, Scanarr doesn't have a built-in exclusion system. You should only include the specific folders you want to scan in the Settings → Scan Folders section. A folder exclusion feature is planned for future releases.</p>
      )
    },
    {
      question: 'What information is included in the downloadable reports?',
      answer: (
        <div>
          <p>The downloadable reports include:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>JSON Reports:</strong> Complete data including file paths, all detected issues, and detailed metadata</li>
            <li><strong>HTML Reports:</strong> Formatted report with tables and sections for easier human reading</li>
          </ul>
          <p className="mt-2">Both report types include information on what rules triggered each problematic file flag.</p>
        </div>
      )
    },
    {
      question: 'How resource-intensive are the scans?',
      answer: (
        <div>
          <p>Scan resource usage depends on your library size:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Small libraries (&lt;1000 files):</strong> Minimal impact, completes quickly</li>
            <li><strong>Medium libraries (1000-10000 files):</strong> Moderate CPU/disk usage during scan</li>
            <li><strong>Large libraries (&gt;10000 files):</strong> Considerable resources required, may take hours</li>
          </ul>
          <p className="mt-2">Consider scheduling scans during off-peak hours for large libraries.</p>
        </div>
      )
    }
  ];

  return (
    <ScanarrLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">Support</h2>
          <p className="text-muted-foreground mt-1">
            Find help, installation instructions, and answers to common questions.
          </p>
        </div>

        {/* Installation Instructions */}
        <div className="scanarr-card">
          <div className="flex items-center space-x-3 mb-4">
            <Terminal className="text-primary" />
            <h3 className="text-lg font-medium">Installation Instructions</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Docker Installation (Recommended)</h4>
              <div className="bg-secondary p-3 rounded-md mt-2 overflow-x-auto">
                <pre className="text-sm">
                  <code>
                    docker run -d \<br />
                    --name=scanarr \<br />
                    -p 8080:8080 \<br />
                    -v /path/to/config:/config \<br />
                    -v /path/to/media:/media \<br />
                    --restart unless-stopped \<br />
                    scanarr/scanarr:latest
                  </code>
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium">Using Docker Compose</h4>
              <div className="bg-secondary p-3 rounded-md mt-2 overflow-x-auto">
                <pre className="text-sm">
                  <code>
                    version: '3'<br />
                    services:<br />
                    &nbsp;&nbsp;scanarr:<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;image: scanarr/scanarr:latest<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;container_name: scanarr<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;ports:<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 8080:8080<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;volumes:<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- /path/to/config:/config<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- /path/to/media:/media<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;restart: unless-stopped
                  </code>
                </pre>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm bg-secondary/50 p-3 rounded-md">
              <Database className="text-primary h-4 w-4" />
              <span>All data is stored in the <code>/config</code> directory in the container.</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm bg-secondary/50 p-3 rounded-md">
              <AlertTriangle className="text-destructive h-4 w-4" />
              <span>For proper scanning, ensure the <code>/media</code> volume is correctly mapped to your media library.</span>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="scanarr-card">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="text-primary" />
            <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
          </div>
          
          <div className="space-y-2">
            {faqItems.map((faq, index) => (
              <div key={index} className="border border-border rounded-md overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-secondary/50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openFAQ === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {openFAQ === index && (
                  <div className="p-4 bg-secondary/30 border-t border-border">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScanarrLayout>
  );
};

export default Support;
