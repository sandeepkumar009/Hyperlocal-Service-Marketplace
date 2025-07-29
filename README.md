# Hyperlocal Service Marketplace (MERN Stack)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack web application that mimics platforms like Urban Company, allowing users to book local services from various providers. This project was a collaborative effort by a team of four, built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It includes features like multi-role authentication, service management, booking, and payment integration.

## ✨ Features

* **Role-Based Access Control:** Secure authentication for three distinct roles: User, Service Provider, and Admin.
* **Service & Category Management:** Admins can manage service categories, while providers can list and manage their services.
* **Search & Discovery:** Users can easily search for available services.
* **Booking System:** A seamless appointment booking workflow with status updates.
* **Reviews & Ratings:** Users can rate and review providers after a service is completed.
* **User & Provider Dashboards:** Dedicated dashboards for users and providers to manage their activities.
* **Payment Gateway Integration:** Integrated with Razorpay for secure payments.
* **File Uploads:** Functionality for uploading profile pictures and service images.
* **Responsive UI:** A clean and modern user interface built with React and styled with Tailwind CSS.

## 🛠️ Tech Stack

| Area      | Technologies                                                                   |
| :-------- | :----------------------------------------------------------------------------- |
| **Frontend** | `React.js`, `React Router`, `Vite`, `Tailwind CSS`, `Axios`                      |
| **Backend** | `Node.js`, `Express.js`, `MongoDB`, `Mongoose`, `JWT`, `bcryptjs`, `Multer`      |
| **Database** | `MongoDB Atlas`                                                                |
| **Payments** | `Razorpay`                                                                     |

## ⚙️ Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

* **Node.js** (v18 or later)
* **npm** (or yarn)
* **MongoDB:** A running instance of MongoDB (local or cloud).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/hyperlocal-service-marketplace.git](https://github.com/your-username/hyperlocal-service-marketplace.git)
    cd hyperlocal-service-marketplace
    ```

2.  **Set up the Backend:**
    ```sh
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Now, open the `backend/.env` file and add your configuration values:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```

3.  **Set up the Frontend:**
    ```sh
    # Navigate to the frontend directory from the root
    cd ../frontend

    # Install dependencies
    npm install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Open the `frontend/.env` file and specify the backend API URL:
    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```

### Seeding the Database (Optional but Recommended)

The project includes a seeder script to populate the database with initial data.

1.  **From the `backend` directory**, run the following commands:
    * To **import** data: `node seeder`
    * To **destroy** all data: `node seeder -d`

2.  **Sample Credentials:**
    * **Admin:** `admin@example.com` / `123456`
    * **User:** `john@example.com` / `123456`
    * **Provider:** `jane@example.com` / `123456`

### Running the Application

1.  **Start the Backend Server:** (from `/backend`)
    ```sh
    npm run server
    ```

2.  **Start the Frontend Development Server:** (from `/frontend`)
    ```sh
    npm run dev
    ```

## 📜 API Endpoints

The backend provides the following RESTful API endpoints:

| Method   | Endpoint                          | Description                                      | Access      |
| :------- | :-------------------------------- | :----------------------------------------------- | :---------- |
| **POST** | `/api/users/register`             | Register a new user or provider                  | Public      |
| **POST** | `/api/users/login`                | Authenticate a user and get a token              | Public      |
| **GET** | `/api/users/profile`              | Get the current user's profile                   | Private     |
| **PUT** | `/api/users/profile`              | Update the current user's profile                | Private     |
| **GET** | `/api/services`                   | Get all services                                 | Public      |
| **POST** | `/api/services`                   | Create a new service                             | Provider    |
| **POST** | `/api/bookings`                   | Create a new booking                             | User        |
| **GET** | `/api/bookings/my-bookings`       | Get all bookings for the logged-in user          | User        |
| **PUT** | `/api/bookings/:id/status`        | Update the status of a booking                   | Provider    |
| **POST** | `/api/payments/create-order`      | Create a Razorpay payment order                  | User        |
| **GET** | `/api/categories`                 | Get all service categories                       | Public      |
| **POST** | `/api/categories`                 | Create a new category                            | Admin       |

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, please feel free to fork the repository and create a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
