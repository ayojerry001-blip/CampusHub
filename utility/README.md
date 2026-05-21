# CampusHub
Final year project 






## 🚀 Project Setup Guide

Follow the steps below to set up the project locally.

---

### 🧾 1. Clone the Repository


git clone https://github.com/JohnPaulAchur/campus-event-system-2026.git
cd repo-name

### ⚙️ 2. Backend (Laravel)

cd backend
composer install
cp .env.example .env
php artisan key:generate

    Configure your .env file with local database credentials.

    Run database migrations:

php artisan migrate
# Optional: php artisan db:seed

    Start the Laravel server:

php artisan serve

#💻 3. Frontend (React)

cd ../frontend
npm install
cp .env.example .env

    In .env, set the API base URL:

REACT_APP_API_URL=http://localhost:8000/api

    Start the React development server:

npm start

###✅ 4. Access

    Frontend: http://localhost:3000

    Backend API: http://localhost:8000/api