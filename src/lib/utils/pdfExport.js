// PDF Export utility for video notes
export const exportNotesToPDF = async (videoTitle, notes) => {
  try {
    // Helper function to format time
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Create a simple HTML structure for the notes
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Video Notes - ${videoTitle}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #8B5CF6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #8B5CF6;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              color: #666;
              margin: 10px 0 0 0;
              font-size: 16px;
            }
            .note {
              background: #f8f9fa;
              border-left: 4px solid #8B5CF6;
              padding: 15px;
              margin-bottom: 20px;
              border-radius: 0 8px 8px 0;
            }
            .note-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .timestamp {
              background: #8B5CF6;
              color: white;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 12px;
              font-weight: bold;
            }
            .note-content {
              margin-bottom: 10px;
              font-size: 14px;
            }
            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }
            .tag {
              background: #e0e7ff;
              color: #5b21b6;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
              color: #666;
              font-size: 12px;
            }
            .stats {
              background: #f0f4ff;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📝 Video Notes</h1>
            <p><strong>${videoTitle}</strong></p>
          </div>
          
          <div class="stats">
            <p><strong>${notes.length}</strong> notes • Generated on ${new Date().toLocaleDateString()}</p>
          </div>

          ${notes.map(note => `
            <div class="note">
              <div class="note-header">
                <span class="timestamp">${formatTime(note.timestamp)}</span>
                <span style="font-size: 12px; color: #666;">${new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="note-content">${note.content}</div>
              ${note.tags && note.tags.length > 0 ? `
                <div class="tags">
                  ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}

          <div class="footer">
            <p>Generated by NTSync Video Player</p>
            <p>Export Date: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    console.log('Notes exported successfully!');

  } catch (error) {
    console.error('Error exporting notes:', error);
  }
};

// Alternative method using jsPDF (if you want actual PDF instead of HTML)
export const exportNotesToPDFAdvanced = async (_videoTitle, _notes) => {
  try {
    // This would require installing jsPDF: npm install jspdf
    console.log('Advanced PDF export requires jsPDF library');
  } catch (error) {
    console.error('Error creating PDF:', error);
  }
};
