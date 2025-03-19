# Feedback Loop (FBL) Mail Processor

## Overview
This project is a TypeScript-based mail processor designed to handle Feedback Loop (FBL) emails from providers like Yahoo and Microsoft. It connects to an email account via IMAP and processes FBL reports to help manage spam complaints.

## Prerequisites
Ensure you have the following installed before proceeding:
- Node.js (>=16.x)
- npm (>=8.x)

## Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <repo-name>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure email credentials:
   - Inside the `src` folder, create a directory called `config`:
     ```sh
     mkdir -p src/config
     ```
   - Inside `config`, create a file named `credentials.ts`:
     ```sh
     touch src/config/credentials.ts
     ```
   - Open `src/config/credentials.ts` and paste the following content:
     ```typescript
     export const EMAIL_CONFIG = {
         user: process.env.EMAIL || "your@fblmailaddress.com", // Email address
         appPassword: process.env.APP_PASSWORD || "your app pass word", // App password
         imapHost: "imap.gmail.com", // IMAP host
         imapPort: 993, // IMAP port
     };

     export const reporterAddress = ""; //specify the email you are getting fbl from
     ```

4. Set up environment variables:
   Create a `.env` file in the project root and add your email credentials:
   ```env
   EMAIL=your-email@example.com
   APP_PASSWORD=your-app-password
   ```

## Running the Project
To start processing FBL emails, run:
```sh
npm run start
```

Once the code has run, you will get a CSV file containing all the emails from the last processed time if present. If not present, it will read emails from the last 24 hours and store the data in a CSV file named `fbl_report_{today_date}.csv` inside the `data` folder. Make sure you create a `data` folder before running the script:
```sh
mkdir -p data
```

## License
This project is licensed under the MIT License.

## Contributing
Pull requests are welcome! If you find any issues, feel free to open an issue or contribute to improving the project.

## Author
Maintained by Hardik Vyas