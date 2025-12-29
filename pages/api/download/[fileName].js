import path from 'path';
import fs from 'fs';

/** Function to fetch file from protected path and enable download only from Annexures page */
export default function handler(req, res) {
  const { fileName, utm_source } = req.query;

  if (utm_source !== "annexure") {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const filePath = path.resolve(__dirname, '../../../../../', 'annexure', fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    fs.stat(filePath, (err) => {
      if (err) {
        console.log("file download error", err);
        return res.status(404).json({ error: 'File not found' });
      }
      // Set headers for the response
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      // Stream the file to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  } else {
    res.status(404).json({ error: 'file not found' });
  }
}
