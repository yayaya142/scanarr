
#!/bin/sh

# Report generation script for Scanarr
# This script creates JSON and HTML reports for problematic files

SCAN_ID=$1
OUTPUT_DIR="/reports/$SCAN_ID"
DATA_FILE="/config/scans/$SCAN_ID.json"

if [ -z "$SCAN_ID" ]; then
  echo "Error: Missing scan ID"
  echo "Usage: generate-report.sh <scan_id>"
  exit 1
fi

# Check if data file exists
if [ ! -f "$DATA_FILE" ]; then
  echo "Error: Data file not found for scan ID: $SCAN_ID"
  exit 1
fi

# Check if scan has problematic files
PROBLEM_FILES=$(jq '.problemFiles | length' "$DATA_FILE")
if [ "$PROBLEM_FILES" -eq 0 ]; then
  echo "No problematic files found in scan $SCAN_ID. Not generating report."
  exit 0
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Copy JSON data
cp "$DATA_FILE" "$OUTPUT_DIR/report.json"
echo "JSON report created: $OUTPUT_DIR/report.json"

# Generate HTML report
JSON_DATA=$(cat "$DATA_FILE")
SCAN_DATE=$(echo "$JSON_DATA" | jq -r '.date')
SCAN_FOLDER=$(echo "$JSON_DATA" | jq -r '.folderPath')
FILE_COUNT=$(echo "$JSON_DATA" | jq -r '.fileCount')
PROBLEM_COUNT=$(echo "$JSON_DATA" | jq -r '.problemFileCount')

cat > "$OUTPUT_DIR/report.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scanarr Report - $SCAN_ID</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #8A2BE2;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .scan-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
    }
    .file-card {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 15px;
      background-color: #fff;
    }
    .file-path {
      font-family: monospace;
      background-color: #f5f5f5;
      padding: 5px;
      border-radius: 3px;
      word-break: break-all;
    }
    .issues-list {
      list-style-type: none;
      padding-left: 0;
    }
    .issues-list li {
      padding: 5px 0;
      padding-left: 20px;
      position: relative;
    }
    .issues-list li:before {
      content: "•";
      color: #DC3545;
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-top: 10px;
      background-color: #f9f9f9;
      padding: 10px;
      border-radius: 3px;
    }
    .metadata-item span:first-child {
      color: #666;
      font-size: 0.9em;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 0.9em;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Scanarr Report</h1>
    <div>Generated: $(date +"%Y-%m-%d %H:%M:%S")</div>
  </div>

  <div class="scan-info">
    <div>
      <strong>Scan ID:</strong><br>
      $SCAN_ID
    </div>
    <div>
      <strong>Date:</strong><br>
      $SCAN_DATE
    </div>
    <div>
      <strong>Folder:</strong><br>
      $SCAN_FOLDER
    </div>
    <div>
      <strong>Files Checked:</strong><br>
      $FILE_COUNT
    </div>
    <div>
      <strong>Problem Files:</strong><br>
      <span style="color: #DC3545; font-weight: bold;">$PROBLEM_COUNT</span>
    </div>
  </div>

  <h2>Problematic Files</h2>
EOF

# Add each problem file to the HTML report
echo "$JSON_DATA" | jq -c '.problemFiles[]' | while read -r file; do
  FILENAME=$(echo "$file" | jq -r '.filename')
  FILEPATH=$(echo "$file" | jq -r '.path')
  
  # Start file card
  cat >> "$OUTPUT_DIR/report.html" << EOF
  <div class="file-card">
    <h3>$FILENAME</h3>
    <div class="file-path">$FILEPATH$FILENAME</div>
    
    <h4>Issues:</h4>
    <ul class="issues-list">
EOF

  # Add each issue
  echo "$file" | jq -r '.issues[]' | while read -r issue; do
    echo "      <li>$issue</li>" >> "$OUTPUT_DIR/report.html"
  done

  # Add metadata section
  cat >> "$OUTPUT_DIR/report.html" << EOF
    </ul>
    
    <h4>File Metadata:</h4>
    <div class="metadata-grid">
      <div class="metadata-item">
        <span>Codec:</span><br>
        $(echo "$file" | jq -r '.metadata.codec')
      </div>
      <div class="metadata-item">
        <span>Bit Depth:</span><br>
        $(echo "$file" | jq -r '.metadata.bitDepth')bit
      </div>
      <div class="metadata-item">
        <span>Audio:</span><br>
        $(echo "$file" | jq -r '.metadata.audioCodec')
      </div>
      <div class="metadata-item">
        <span>Subtitles:</span><br>
        $(echo "$file" | jq -r '.metadata.hasSubtitles' | sed 's/true/Yes/;s/false/No/')
      </div>
      <div class="metadata-item">
        <span>Resolution:</span><br>
        $(echo "$file" | jq -r '.metadata.resolution')
      </div>
      <div class="metadata-item">
        <span>Size:</span><br>
        $(echo "$file" | jq -r '.metadata.size')
      </div>
    </div>
  </div>
EOF
done

# Close HTML document
cat >> "$OUTPUT_DIR/report.html" << EOF
  <div class="footer">
    <p>Generated by Scanarr - Media Scanner</p>
  </div>
</body>
</html>
EOF

echo "HTML report created: $OUTPUT_DIR/report.html"
exit 0
