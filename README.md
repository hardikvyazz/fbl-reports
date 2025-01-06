# Gmail Abuse Report Processor

A Node.js application that processes Gmail abuse reports and extracts key details such as the reporter's email, original sender, recipient, domain, and inbox date. The data is exported into a CSV file for easy analysis.

---

## Features

- Authenticate with Gmail using OAuth2.
- Retrieve abuse reports filtered by sender.
- Parse and extract information from emails (reporter, sender, recipient, domain, and inbox date).
- Save extracted data to a CSV file.
- Handles email pagination for large datasets.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: v14.x or later
- **npm**: Comes with Node.js
- A **Google Cloud Project** with the Gmail API enabled
- A `credentials.json` file downloaded from the [Google Cloud Console](https://console.cloud.google.com/).

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hardikvyazz/gmail-abuse-reports.git
   cd gmail-abuse-reports
