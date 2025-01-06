const fs = require('fs');
const { google } = require('googleapis');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const express = require('express');
const base64url = require('base64url');
const { simpleParser } = require('mailparser');

const app = express();
const PORT = 3000;

const CREDENTIALS_PATH = 'credentials.json'; // Your credentials file
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

async function authorize() {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    const { client_secret, client_id, redirect_uris } = JSON.parse(content).web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    return new Promise((resolve, reject) => {
        app.get('/oauth2callback', (req, res) => {
            const code = req.query.code;
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return reject('Error retrieving access token');
                oAuth2Client.setCredentials(token);
                fs.writeFileSync('token.json', JSON.stringify(token));
                res.send('Authentication successful! You can close this tab.');
                resolve(oAuth2Client);
            });
        });
    });
}

async function processReports(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    // Generate dynamic filename with today's date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const fileName = `fbl_reports_${formattedDate}.csv`;
    console.log(fileName);
    
    const csvWriter = createCsvWriter({
        path: fileName,
        header: [
            { id: 'Reporter', title: 'Reporter' },
            { id: 'Original_Sender', title: 'Original Sender' },
            { id: 'Original_Recipient', title: 'Original Recipient' },
            { id: 'Domain', title: 'Domain' },
            { id: 'Inbox_Date', title: 'Inbox Date' }, // New inbox date column
        ],
    });

    let emailData = [];
    let pageToken = null;

    do {
        const res = await gmail.users.messages.list({
            userId: 'me',
            pageToken: pageToken,
            maxResults: 100,
            q: 'from:feedback@arf.mail.yahoo.com', // Filter for reports
        });
        const messages = res.data.messages;

        if (messages && messages.length) {
            for (const message of messages) {
                const msg = await gmail.users.messages.get({ userId: 'me', id: message.id, format: 'raw' });
                const rawMessage = base64url.decode(msg.data.raw);
                const parsedEmail = await simpleParser(rawMessage);

                // Extract the relevant fields
                const reporter = parsedEmail.from.text; // This should be "feedback@arf.mail.yahoo.com"
                const forwardedMessage = parsedEmail.text; // Assuming the email body contains the forwarded message

                // Extracting Original Sender and Recipient from the forwarded message
                const forwardedLines = forwardedMessage.split('\n');
                let originalSender = '';
                let originalRecipient = '';
                
                for (const line of forwardedLines) {
                    if (line.startsWith('From:')) {
                        originalSender = line.split('From: ')[1].trim();
                    }
                    if (line.startsWith('To:')) {
                        originalRecipient = line.split('To: ')[1].trim();
                    }
                }

                // Extract the domain from the original sender's email
                const domain = originalSender.includes('@') ? originalSender.split('@')[1] : 'N/A';

                // Collect the extracted information
                console.log(emailData);
                // Extract the inbox date from internalDate
                const inboxDate = new Date(parseInt(msg.data.internalDate)).toLocaleString();

                // Collect the extracted information
                emailData.push({
                    Reporter: reporter || 'N/A',
                    Original_Sender: originalSender || 'N/A',
                    Original_Recipient: originalRecipient || 'N/A',
                    Domain: domain || 'N/A',
                    Inbox_Date: inboxDate, // Add inbox date
                });
            }
        }

        pageToken = res.data.nextPageToken;
    } while (pageToken);

    await csvWriter.writeRecords(emailData);
    console.log(`Email reports saved to ${fileName}`);
}

async function main() {
    try {
        const auth = await authorize();
        await processReports(auth);
    } catch (error) {
        console.error('Error:', error);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    main();
});