# MeatBooking Full-Stack App

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB database (local or cloud)
- Razorpay account (for payment keys)


## Backend Setup (Express + MongoDB)
### 1. Run MongoDB Locally (Offline)
- **Install MongoDB Community Edition** from https://www.mongodb.com/try/download/community
- **Start MongoDB server locally:**
  - On Windows, run:
    ```sh
    "C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="C:\data\db"
    ```
    (Replace `<version>` with your installed version. Create `C:\data\db` if it doesn't exist.)
  - On Mac/Linux, run:
    ```sh
    mongod --dbpath ~/data/db
    ```
- The default local connection string is:
  ```
  mongodb://localhost:27017/meatbooking
  ```

### 2. Configure Backend
1. Open a terminal and navigate to the `server` directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in `server/` with the following:
   ```env
   MONGO_URI=mongodb://localhost:27017/meatbooking
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=5000
   ```
4. Start the backend server:
   ```sh
   node index.js
   ```

## Frontend Setup (React)
1. Open a new terminal and navigate to the `client` directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```

## Usage
- Register or log in as a user.
- Book meat orders and pay via Razorpay.
- View your orders in the summary.
- Log in as an admin to view/manage all orders.

## Notes
- Update API URLs if deploying to production.
- Replace all placeholder keys and secrets with your actual credentials.
