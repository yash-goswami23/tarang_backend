# Tarang Backend API 🎵

The **Tarang Backend API** is a RESTful service built with **Node.js + Express**, designed to support cross-platform clients including **Flutter mobile apps**, **web apps**, and **Postman** for testing. It uses **JWT authentication**, **MongoDB Atlas** for database, and integrates with **JioSaavn** to fetch data.

## 🌐 Live API Base URL
**`https://tarang-flar.onrender.com`**

---

## 📦 Technologies Used

- Node.js
- Express
- MongoDB (via Mongoose)
- JWT Authentication
- dotenv for environment variables
- Helmet for security
- Bcrypt for password hashing

---

## 📁 Folder Structure

```
tarang-backend/
├── controllers/           # Route logic for auth and music
├── middlewares/           # JWT verification, error handling
├── models/                # Mongoose schemas
├── routes/                # Express route definitions
├── utils/                 # Helper functions
├── .env                   # Environment variables (local only)
├── index.js               # App entry point
└── package.json           # Project metadata and scripts
```

---

## ⚙️ Setup Instructions (Local Development)

```bash
# 1. Clone the repo
git clone https://github.com/yash-goswami23/tarang-backend-api.git

# 2. Navigate into the project
cd tarang-backend-api

# 3. Install dependencies
npm install

# 4. Create a .env file (see below for keys)

# 5. Start the server
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file at the root with the following keys:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## 🚀 API Endpoints

### Auth Routes (`/api/v1/auth`)

| Method | Route                | Description                     |
|--------|----------------------|---------------------------------|
| POST   | `/signup`            | Register a new user             |
| POST   | `/signin`            | Sign in with credentials        |
| POST   | `/logout`            | Logout user (requires token)    |
| POST   | `/refresh-token`     | Get a new access token          |
| POST   | `/change-password`   | Change current password         |
| GET    | `/current-user`      | Fetch current user info         |

### Music Routes (`/api/v1/musics`)

| Method | Route                | Description                         |
|--------|----------------------|-------------------------------------|
| GET    | `/top-musics`        | Fetch top trending music            |
| GET    | `/search-artist`     | Search music by artist              |
| GET    | `/artists`           | Get list of supported artists       |
| GET    | `/search-musics`     | Search music by keywords            |

---

## 📡 Example Request/Response

### GET `/api/v1/musics/top-musics`

**Request:**

```
GET https://tarang-flar.onrender.com/api/v1/musics/top-musics
```
**Body**
```json
{
  "artists": ["Arijit Singh", "Kishore Kumar", "Eminem", "B Praak", "Ikka"]
}
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Tum Hi Ho",
      "artist": "Arijit Singh",
      "album": "Aashiqui 2",
      "url": "https://link_to_song.com"
    },
    ...
  ]
}
```

---

## ☁️ Deployment

- **Hosting:** [Render](https://render.com)
- **Uptime Monitoring:** [UptimeRobot](https://uptimerobot.com)

---

## 👤 Author

**Yash Goswami**  
GitHub: [https://github.com/yash-goswami23](https://github.com/yash-goswami23)

---

## 📌 License

This project is licensed under the **MIT License**.

---

## 🔮 Future Improvements

- Add user playlist support
- In-app analytics and search trends
- Premium user subscription model
