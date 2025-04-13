# CampusKart - Campus Marketplace Platform

CampusKart is a modern marketplace platform designed specifically for college campuses, enabling students to buy and sell items within their campus community.

## Features

### User Authentication
- Secure user registration and login
- Profile management with profile pictures
- JWT-based authentication

### Product Management
- Create, read, update, and delete product listings
- Product categories and search functionality
- Image upload for product listings
- Price negotiation system

### Real-time Chat System
- Instant messaging between buyers and sellers
- Chat history preservation
- Real-time message updates
- Unread message indicators

### User Interface
- Modern, responsive design using Tailwind CSS
- Dark mode support
- Mobile-friendly interface
- Intuitive navigation

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for UI components
- Socket.IO for real-time chat

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Socket.IO for real-time features

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SyedTanseer/CampusKart-Beta.git
cd CampusKart-Beta
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:
```bash
# Start frontend
npm run dev

# Start backend (in a separate terminal)
cd backend
npm run dev
```

## Project Structure

```
CampusKart-Beta/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── backend/               # Backend source code
│   ├── src/              # Backend source files
│   └── models/           # Database models
├── public/               # Static assets
└── scripts/             # Build and deployment scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Syed Tanseer - [GitHub](https://github.com/SyedTanseer)

Project Link: [https://github.com/SyedTanseer/CampusKart-Beta](https://github.com/SyedTanseer/CampusKart-Beta)
