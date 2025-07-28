# Node.js Backend Project

## Overview
This project is a Node.js backend application that utilizes Express.js to create a RESTful API for fetching time zone data from a Supabase database.

## Project Structure
```
node-backend-project
├── src
│   ├── app.js
│   ├── config
│   │   └── supabase.js
│   ├── controllers
│   │   └── timezoneController.js
│   ├── routes
│   │   └── timezoneRoutes.js
│   └── services
│       └── timezoneService.js
├── package.json
├── .env
└── README.md
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-backend-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## API Usage

### Get Time Zone Data
- **Endpoint:** `GET /api/timezones`
- **Description:** Fetches time zone data from the Supabase database.
- **Response:**
  - `200 OK` with time zone data in JSON format.

## License
This project is licensed under the MIT License.