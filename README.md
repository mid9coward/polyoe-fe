# Video Management System - Frontend

Vue.js frontend application for the Video Management System.

## Features

- **Users Management**: Create, read, update, and delete users
- **Videos Management**: Manage video content with poster images
- **Favorites Management**: Track user favorite videos
- **Shares Management**: Monitor video sharing activity
- **View Histories Management**: Track video viewing patterns

## Technologies Used

- Vue.js 3 with Composition API
- Vue Router for navigation
- Bootstrap 5 for styling
- Axios for API communication
- Font Awesome for icons

## Setup Instructions

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

## Configuration

The frontend is configured to connect to the backend API at `http://localhost:1212/api`. 

Make sure your backend server is running before starting the frontend application.

## Project Structure

\`\`\`
src/
├── views/              # Page components
│   ├── Home.vue
│   ├── Users.vue
│   ├── Videos.vue
│   ├── Favorites.vue
│   ├── Shares.vue
│   └── ViewHistories.vue
├── services/           # API services
│   └── api.js
├── App.vue            # Root component
└── main.js            # Application entry point
\`\`\`

## API Integration

The application integrates with the following backend endpoints:

- `/api/users` - User management
- `/api/videos` - Video management
- `/api/favorites` - Favorites management
- `/api/shares` - Shares management
- `/api/viewhistories` - View histories management

## Features

### Navigation
- Responsive navigation bar with links to all sections
- Active route highlighting

### CRUD Operations
- Create, Read, Update, Delete operations for all entities
- Modal forms for creating and editing records
- Confirmation dialogs for delete operations

### User Experience
- Loading indicators during API calls
- Toast notifications for success/error messages
- Responsive design that works on all devices
- Bootstrap styling for professional appearance

### Error Handling
- Global error handling for API calls
- User-friendly error messages
- Proper validation for form inputs

## Usage

1. **Home Page**: Overview dashboard with quick access to all sections
2. **Users**: Manage user accounts and admin permissions
3. **Videos**: Upload and manage video content with metadata
4. **Favorites**: Track which videos users have favorited
5. **Shares**: Monitor video sharing activity via email
6. **View Histories**: Analyze video viewing patterns

## Development

The application uses Vue 3's Composition API for better code organization and TypeScript-like development experience. All components are reactive and use modern Vue.js patterns.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
