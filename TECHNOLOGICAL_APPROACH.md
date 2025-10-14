# StayFinder - Technological Approach

## 1. Architecture Overview

### **System Architecture**
- **Pattern**: Client-Server Architecture with RESTful API
- **Deployment**: Separated frontend and backend services
- **Communication**: HTTP/HTTPS with JSON data exchange
- **State Management**: Redux Toolkit (Frontend) + MongoDB (Backend)

---

## 2. Frontend Technology Stack

### **Core Framework & Build Tools**
- **React 19.1.0**: Modern UI library with hooks and functional components
- **Vite 6.3.5**: Next-generation frontend build tool for fast development
- **React Router DOM 7.6.3**: Client-side routing and navigation

### **UI/UX Libraries**
- **Tailwind CSS 4.1.10**: Utility-first CSS framework for rapid styling
- **Material-UI (MUI) 7.1.2**: Component library for consistent design
- **Framer Motion 12.18.1**: Animation library for smooth transitions
- **Lucide React 0.525.0**: Modern icon library
- **React Icons 5.5.0**: Additional icon sets

### **State Management**
- **Redux Toolkit**: Centralized state management
  - `userSlice.js`: User authentication and profile state
  - `productSlice.js`: Listing/property data state
- **React Redux 9.2.0**: React bindings for Redux

### **Date & Time Management**
- **Day.js 1.11.13**: Lightweight date manipulation
- **React Calendar 6.0.0**: Calendar component for date selection
- **MUI X Date Pickers 8.5.2**: Advanced date picker components

### **HTTP Client**
- **Axios 1.10.0**: Promise-based HTTP client for API requests

### **Authentication**
- **@react-oauth/google 0.12.2**: Google OAuth integration

### **Data Visualization**
- **Recharts 3.0.2**: Charts for analytics dashboard

### **Code Quality**
- **ESLint 9.25.0**: Code linting and quality enforcement
- **TypeScript Types**: Type definitions for React

---

## 3. Backend Technology Stack

### **Runtime & Framework**
- **Node.js**: JavaScript runtime environment
- **Express.js 4.17.1**: Minimal and flexible web application framework
- **ES Modules**: Modern module system (type: "module")

### **Database**
- **MongoDB**: NoSQL document database
- **Mongoose 8.15.2**: ODM (Object Data Modeling) library
  - Schema validation
  - Middleware hooks
  - Query building

### **Authentication & Security**
- **JWT (jsonwebtoken 9.0.2)**: Token-based authentication
  - Access tokens
  - Refresh tokens
- **Bcrypt 6.0.0**: Password hashing
- **Passport.js 0.7.0**: Authentication middleware
  - `passport-google-oauth20 2.0.0`: Google OAuth strategy
  - `passport-google-id-token 0.4.7`: Google ID token verification
- **Cookie Parser 1.4.7**: Cookie handling

### **File Upload & Storage**
- **Multer 2.0.1**: Multipart/form-data handling for file uploads
- **Cloudinary 2.7.0**: Cloud-based image and video management

### **Payment Integration**
- **Razorpay 2.9.6**: Payment gateway integration

### **Email Service**
- **Nodemailer 7.0.5**: Email sending functionality

### **Validation**
- **Validator 13.15.15**: String validation and sanitization

### **CORS & Middleware**
- **CORS 2.8.5**: Cross-Origin Resource Sharing configuration
- **Custom Middleware**:
  - Authentication middleware
  - Error handling
  - File upload middleware

### **Development Tools**
- **Nodemon 2.0.4**: Auto-restart server on file changes
- **Dotenv 8.2.0**: Environment variable management

---

## 4. Database Design

### **Collections (Models)**

#### **User Model**
```javascript
{
  name: String (required),
  avatar: String,
  email: String (unique, required),
  password: String (hashed, conditional),
  hostType: String (default: false),
  timestamps: true
}
```

#### **Listing Model**
```javascript
{
  title: String (required),
  description: String,
  location: {
    state: String,
    district: String,
    city: String,
    pincode: String (validated)
  },
  pricePerNight: Number,
  images: [{ url: String, title: String }],
  host: ObjectId (ref: User),
  availableDates: [{ start: Date, end: Date }],
  bookedSlots: [{ startDateTime: Date, endDateTime: Date }],
  timestamps: true
}
```

#### **Booking Model**
- Manages reservation data
- Links users to listings

#### **Wishlist Model**
- User's saved/favorite listings

---

## 5. API Architecture

### **RESTful Endpoints**
- **Base URL**: `/api/v1`
- **Routes**:
  - `/users`: User authentication and management
  - `/listing`: Property CRUD operations
  - `/bookings`: Booking management
  - `/wishlist`: Wishlist operations

### **Authentication Flow**
1. User registers/logs in
2. Server generates JWT access & refresh tokens
3. Tokens stored in HTTP-only cookies
4. Protected routes verify token via middleware
5. Google OAuth as alternative authentication

---

## 6. Key Features Implementation

### **User Roles**
- **Guest**: Browse, search, book properties
- **Host/Owner**: List properties, manage bookings
- **Admin**: Platform management, analytics

### **Search & Filter**
- Location-based search
- Date availability checking
- Price range filtering
- Guest count filtering

### **Booking System**
- Real-time availability checking
- Date conflict prevention
- Payment integration (Razorpay)
- Booking confirmation emails

### **Wishlist**
- Add/remove listings
- Persistent storage per user

### **Image Management**
- Multi-image upload
- Cloudinary CDN storage
- Interactive image gallery

### **Admin Dashboard**
- User management
- Listing management
- Booking oversight
- Analytics & charts
- Settings configuration

### **Owner Dashboard**
- Business registration
- Add/edit listings
- View bookings
- Revenue tracking

---

## 7. Security Measures

### **Authentication**
- JWT-based stateless authentication
- Refresh token rotation
- Password hashing with bcrypt (10 rounds)
- Google OAuth for social login

### **Data Protection**
- Input validation and sanitization
- MongoDB injection prevention via Mongoose
- CORS configuration for allowed origins
- HTTP-only cookies for token storage

### **API Security**
- Protected routes with auth middleware
- Request size limits (16kb)
- Environment variable protection

---

## 8. Performance Optimizations

### **Frontend**
- **Code Splitting**: Lazy loading for admin routes
- **Suspense**: Loading states during async imports
- **Vite**: Fast HMR (Hot Module Replacement)
- **Tailwind CSS**: Purged unused styles in production

### **Backend**
- **Connection Pooling**: MongoDB connection management
- **Async/Await**: Non-blocking operations
- **Static File Serving**: Express static middleware

---

## 9. Development Workflow

### **Frontend**
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Code linting
```

### **Backend**
```bash
npm start        # Production server
npm run dev      # Development with nodemon
```

### **Environment Configuration**
- Frontend: `.env` with API URLs, OAuth credentials
- Backend: `.env` with MongoDB URI, JWT secrets, API keys

---

## 10. Deployment Strategy

### **Frontend**
- Build optimized bundle with Vite
- Deploy to static hosting (Vercel, Netlify, Railway)
- Environment variables for production API

### **Backend**
- Deploy to cloud platform (Railway, Heroku, AWS)
- MongoDB Atlas for database hosting
- Environment variables for production secrets
- CORS configured for production domain

### **Current Deployment**
- Frontend: `http://localhost:5173` (dev)
- Backend: Railway (`https://stayfinder-production-6a9f.up.railway.app`)

---

## 11. Third-Party Integrations

### **Cloud Services**
- **Cloudinary**: Image/video storage and optimization
- **MongoDB Atlas**: Database hosting (assumed)

### **Payment Gateway**
- **Razorpay**: Indian payment processing

### **Authentication**
- **Google OAuth 2.0**: Social login

### **Email Service**
- **Nodemailer**: Transactional emails (booking confirmations, etc.)

---

## 12. Code Organization

### **Frontend Structure**
```
src/
├── components/       # Reusable UI components
│   ├── admin/       # Admin dashboard components
│   └── owner/       # Owner dashboard components
├── pages/           # Route-level components
├── store/           # Redux state management
├── backendConnect/  # API integration layer
├── assets/          # Static assets
└── App.jsx          # Main routing configuration
```

### **Backend Structure**
```
src/
├── controllers/     # Business logic
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── middlewares/     # Custom middleware
├── config/          # Configuration (passport, email)
├── db/              # Database connection
└── utils/           # Utility functions
```

---

## 13. Scalability Considerations

### **Current Architecture**
- Monolithic backend with modular structure
- Stateless authentication (JWT)
- Cloud-based file storage

### **Future Enhancements**
- **Microservices**: Separate booking, payment, notification services
- **Caching**: Redis for session and query caching
- **CDN**: Static asset delivery
- **Load Balancing**: Multiple backend instances
- **WebSockets**: Real-time booking updates
- **Search Engine**: Elasticsearch for advanced search
- **Message Queue**: RabbitMQ/Kafka for async tasks

---

## 14. Testing Strategy (Recommended)

### **Frontend**
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright/Cypress
- Component testing: Storybook

### **Backend**
- Unit tests: Jest/Mocha
- Integration tests: Supertest
- API testing: Postman/Newman

---

## 15. Monitoring & Analytics

### **Application Monitoring**
- Error tracking: Sentry (recommended)
- Performance monitoring: New Relic/DataDog (recommended)
- Analytics: Google Analytics (frontend)

### **Database Monitoring**
- MongoDB Atlas monitoring
- Query performance analysis

---

## Summary

StayFinder employs a modern **MERN stack** (MongoDB, Express, React, Node.js) with additional technologies for enhanced functionality:

- **Frontend**: React + Vite + Tailwind CSS + Redux Toolkit
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Authentication**: JWT + Google OAuth
- **File Storage**: Cloudinary
- **Payment**: Razorpay
- **Email**: Nodemailer

The architecture follows **separation of concerns**, with clear boundaries between presentation (React), business logic (Express controllers), and data (MongoDB). The system is designed for **scalability**, **security**, and **maintainability** with modern development practices.
