# 🚀 User Management System - Admin Panel

## Overview

The User Management System has been completely updated to support the new comprehensive user profile format and API endpoints. This system provides administrators with full control over user profiles, subscriptions, and billing information.

## ✨ New Features

### 🔍 Enhanced User Table
- **Comprehensive Display**: Shows name, phone, location, food preference, subscription status, and Stripe ID
- **Smart Filtering**: Search by name, phone, city, or subscription details
- **Visual Status Indicators**: Color-coded subscription status badges
- **Improved Pagination**: Better navigation with 10 users per page

### 📝 Advanced User Forms
- **Tabbed Interface**: Separate tabs for Profile Information and Subscription & Billing
- **Profile Tab**: Complete personal information, address, and food preferences
- **Subscription Tab**: Stripe customer ID, subscription status, and subscription ID
- **Form Validation**: Proper input validation and error handling

### 👁️ User Details Modal
- **Complete Profile View**: All user information in an organized, readable format
- **Visual Organization**: Icons and sections for different information types
- **Responsive Design**: Works on all screen sizes

## 🏗️ Architecture

### Type Definitions (`lib/types.ts`)
```typescript
export interface UserProfile {
  auth0Id: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  birthDate?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  foodPreference?: string | null;
  stripeCustomerId?: string | null;
  subscriptionStatus?: "active" | "inactive" | "expired" | "cancelled" | null;
  subscriptionId?: string | null;
  subscriptionType?: "monthly" | "weekly" | "daily" | "yearly" | "custom" | null;
}
```

### API Endpoints (`lib/constants.ts`)
```typescript
export const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/api/users`,
  USER_PROFILE: (auth0Id: string) => `${API_BASE_URL}/api/users/${auth0Id}/extended-profile`,
  USER_SUBSCRIPTION: (auth0Id: string) => `${API_BASE_URL}/api/users/${auth0Id}`,
  USER_SUBSCRIPTION_STATUS: (auth0Id: string) => `${API_BASE_URL}/api/users/${auth0Id}/subscription-status`,
}
```

### Service Layer (`lib/user-service.ts`)
- **Centralized API Logic**: All user operations handled through UserService class
- **Error Handling**: Consistent error handling and user feedback
- **Type Safety**: Full TypeScript support for all operations

## 🔧 API Operations

### Read Operations
- **Get All Users**: `GET /api/users` - Fetch all users for admin dashboard
- **Get Specific User**: `GET /api/users/{auth0Id}` - Get detailed user information

### Update Operations
- **Update Profile**: `PUT /api/users/{auth0Id}/extended-profile` - Update personal information
- **Update Subscription**: `PUT /api/users/{auth0Id}` - Update billing and subscription data

### Delete Operations
- **Delete User**: `DELETE /api/users/{auth0Id}` - Remove user from system

### Subscription Management
- **Get Subscription Status**: `GET /api/users/{auth0Id}/subscription-status` - Check subscription health

## 🎯 Admin Panel Features

### User Management Table
- **Display**: All users with pagination (10 per page)
- **Search**: Multi-field search functionality
- **Actions**: View, Edit Profile, Edit Subscription, Delete
- **Status Indicators**: Visual subscription status badges

### User Detail Modal
- **Personal Information**: Name, phone, birth date, food preference
- **Address Details**: Complete address information
- **Subscription Info**: Status, IDs, and billing details
- **Quick Actions**: Easy access to edit functions

### Edit Forms
- **Profile Tab**: Personal and address information
- **Subscription Tab**: Billing and subscription management
- **Validation**: Form validation and error handling
- **Responsive**: Works on all device sizes

## 🚀 Implementation Examples

### Fetching All Users
```typescript
const users = await UserService.getAllUsers()
```

### Updating User Profile
```typescript
const profileUpdate = {
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "1234567890",
  // ... other profile fields
}

await UserService.updateUserProfile(auth0Id, profileUpdate)
```

### Updating User Subscription
```typescript
const subscriptionUpdate = {
  firstName: "John",
  lastName: "Doe",
  stripeCustomerId: "cus_updated123",
  subscriptionStatus: "active",
  subscriptionId: "sub_updated123"
}

await UserService.updateUserSubscription(auth0Id, subscriptionUpdate)
```

### Deleting a User
```typescript
await UserService.deleteUser(auth0Id)
```

## 🔒 Security Features

- **Admin Authentication**: JWT token required for all operations
- **User Isolation**: Admins can only access authorized data
- **Input Validation**: Form validation and sanitization
- **Error Handling**: Secure error messages without data leakage

## 📱 Responsive Design

- **Mobile First**: Optimized for all screen sizes
- **Touch Friendly**: Proper touch targets for mobile devices
- **Responsive Tables**: Adapts to different screen widths
- **Modal Dialogs**: Proper mobile modal behavior

## 🎨 UI Components Used

- **shadcn/ui**: Modern, accessible UI components
- **Lucide Icons**: Consistent iconography
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form management and validation

## 🔄 State Management

- **Local State**: Component-level state for UI interactions
- **Form State**: React Hook Form for form management
- **API State**: Loading states and error handling
- **Optimistic Updates**: Immediate UI feedback for better UX

## 📊 Data Flow

1. **Page Load**: Fetch all users from API
2. **User Search**: Filter users based on search query
3. **User Actions**: Handle view, edit, and delete operations
4. **Form Submission**: Update user data via appropriate API endpoint
5. **State Update**: Refresh user list and show success/error messages

## 🚀 Getting Started

### Prerequisites
- Next.js 13+ with App Router
- TypeScript
- shadcn/ui components
- Tailwind CSS

### Installation
1. Ensure all dependencies are installed
2. Update your API base URL in `lib/constants.ts`
3. Import and use the components in your pages

### Usage
```typescript
import { UserTable } from "@/components/users/user-table"
import { UserForm } from "@/components/users/user-form"
import { UserDetailsModal } from "@/components/users/user-details-modal"

// Use in your page component
<UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
```

## 🔧 Customization

### Adding New Fields
1. Update the `UserProfile` interface in `lib/types.ts`
2. Add form fields in `components/users/user-form.tsx`
3. Update the table display in `components/users/user-table.tsx`
4. Modify the details modal in `components/users/user-details-modal.tsx`

### Modifying API Endpoints
1. Update endpoints in `lib/constants.ts`
2. Modify the `UserService` class in `lib/user-service.ts`
3. Update the main page component to use new endpoints

### Styling Changes
- Use Tailwind CSS classes for styling
- Modify component variants in shadcn/ui
- Update color schemes and spacing as needed

## 🐛 Troubleshooting

### Common Issues
- **API Errors**: Check network tab and console for error details
- **Type Errors**: Ensure all interfaces are properly imported
- **Form Issues**: Verify form validation and required fields
- **Styling Problems**: Check Tailwind CSS configuration

### Debug Mode
- Enable console logging in development
- Use React DevTools for component inspection
- Check network requests in browser dev tools

## 📈 Future Enhancements

- **Bulk Operations**: Select multiple users for batch actions
- **Advanced Filtering**: Date ranges, subscription status filters
- **Export Functionality**: CSV/Excel export of user data
- **Audit Logging**: Track admin actions and changes
- **User Analytics**: Usage statistics and insights
- **Real-time Updates**: WebSocket integration for live data

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Maintain consistent styling with Tailwind CSS
4. Add proper error handling and validation
5. Test on multiple screen sizes
6. Update documentation for new features

## 📄 License

This project follows the same license as the main application.

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**
