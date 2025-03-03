const express = require("express");
const router = express.Router();
const { generatePresignedUrl } = require('./s3Utils');


router.get('/get-presigned-url', async (req, res) => {
  const { key } = req.query; // S3 key passed as a query parameter

  if (!key) {
    return res.status(400).json({ error: 'Key is required' });
  }

  try {
    const url = await generatePresignedUrl(key);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate pre-signed URL' });
  }
});

module.exports = router;
