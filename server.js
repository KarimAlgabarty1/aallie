const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', (req, res) => {
  const { name, email, artistType, packageInterest, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const submission = {
    timestamp: new Date().toISOString(),
    name,
    email,
    artistType,
    packageInterest,
    message
  };

  const submissionsFile = path.join(__dirname, 'submissions.json');
  let submissions = [];

  if (fs.existsSync(submissionsFile)) {
    const data = fs.readFileSync(submissionsFile, 'utf8');
    submissions = JSON.parse(data || '[]');
  }

  submissions.push(submission);
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));

  console.log('New contact submission:', submission);
  res.json({ success: true, message: 'Thank you for reaching out!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Aallie running on port ${PORT}`);
});
