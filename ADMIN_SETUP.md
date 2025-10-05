# Admin Portal Setup Guide

## Overview
Your LG Warranty Manager now has a complete authentication system with role-based access control. The system includes:
- **User Portal** at `/portal` - For regular users to manage their customers and warranties
- **Admin Portal** at `/admin` - For administrators to view all customer data and system analytics

## Security Features
✅ **Secure Authentication**: Real Supabase authentication with password hashing  
✅ **Role-Based Access Control**: Admin roles stored in separate `user_roles` table  
✅ **Row-Level Security (RLS)**: Database policies enforce data access rules  
✅ **Protected Routes**: Frontend route guards prevent unauthorized access  
✅ **JWT Tokens**: Session management with automatic token refresh  

## How to Set Up Admin Access

### Step 1: Register the Admin Account
1. Go to `/register` in your application
2. Create an account with the email: `amazonshopinnn@gmail.com`
3. Use a strong password (at least 6 characters)
4. Complete the registration

### Step 2: Assign Admin Role
After registering, you need to manually assign the admin role to this user in your backend:

**Option A: Using Backend Dashboard**
1. Click the button below to open your backend:
   <lov-actions>
     <lov-open-backend>View Backend</lov-open-backend>
   </lov-actions>

2. Navigate to the `user_roles` table
3. Click "Insert row"
4. Set:
   - `user_id`: Copy the user ID from the `profiles` table for amazonshopinnn@gmail.com
   - `role`: Select `admin`
5. Click "Save"

**Option B: Using SQL Query**
Run this query in your backend SQL editor (replace USER_ID with the actual user ID):
```sql
-- First, find the user ID
SELECT id, email FROM auth.users WHERE email = 'amazonshopinnn@gmail.com';

-- Then, insert the admin role (replace 'USER_ID_HERE' with the actual ID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin');
```

### Step 3: Test Admin Access
1. Log in with `amazonshopinnn@gmail.com`
2. You'll be automatically redirected to `/admin` (the admin dashboard)
3. You should see:
   - Statistics cards showing total customers, warranties, etc.
   - Complete list of all customers across all users
   - All warranty items in the system
   - Recent reminder logs

## User vs Admin Behavior

### Regular Users
- Login redirects to `/portal`
- Can only see their own customers and warranties
- Can add/edit their own data
- Cannot access `/admin` routes

### Admin Users
- Login redirects to `/admin`
- Can see ALL customers and warranties from all users
- Has full read access to all data
- Can manage roles of other users

## Database Schema

The system uses these key tables:

**`profiles`** - User profile information
- Linked to auth.users
- Stores email and full name

**`user_roles`** - Role assignments
- Links users to roles (admin/user)
- Uses enum type for role validation
- Protected by RLS policies

**`customers`** - Customer data
- Each customer belongs to a user
- Admins can see all customers
- Users only see their own

**`warranty_items`** - Product warranties
- Linked to customers
- Tracks expiry dates and purchase info
- Admins have full visibility

**`reminder_logs`** - SMS reminder history
- Tracks when reminders were sent
- Shows delivery status

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── components/
│   └── ProtectedRoute.tsx       # Route protection wrapper
├── pages/
│   ├── Login.tsx                # Real authentication login
│   ├── Register.tsx             # Real authentication signup
│   ├── Portal.tsx               # User portal layout
│   ├── portal/
│   │   └── Customers.tsx        # User customer management
│   └── admin/
│       ├── AdminLayout.tsx      # Admin portal layout
│       └── AdminDashboard.tsx   # Admin dashboard with all data
└── App.tsx                      # Routing with protected routes
```

## Security Best Practices

✅ **What we did right:**
- Passwords are hashed by Supabase (never stored in plain text)
- Admin role stored in database, not client-side
- Row-Level Security policies enforce data access
- JWT tokens used for session management
- Security definer functions prevent RLS recursion
- Protected routes on both frontend and backend

❌ **What we avoided:**
- No hardcoded credentials in code
- No client-side role storage (localStorage, etc.)
- No direct auth table modifications
- No sensitive data in URLs or logs

## Troubleshooting

**Problem: Can't access admin portal after logging in**
- Verify the admin role was added to `user_roles` table
- Check that the `user_id` matches the user's ID in `auth.users`
- Ensure you're logged in with the correct email

**Problem: Getting "permission denied" errors**
- Check RLS policies are correctly set up
- Verify the `has_role()` function exists
- Make sure the user has authenticated successfully

**Problem: Login redirects to portal instead of admin**
- The role check happens asynchronously
- Refresh the page after logging in
- Verify the role was assigned correctly in the database

## Next Steps

1. **Test the system**: Create test customers and warranties
2. **Add more admins**: Insert additional admin role records
3. **Customize permissions**: Modify RLS policies for specific needs
4. **Add audit logging**: Track admin actions for security

## Important Notes

- **Auto-confirm email** is enabled in backend settings for faster testing
- **Regular users** get the 'user' role automatically on signup
- **Only admins** can assign admin roles to other users
- **All passwords** are securely hashed and never exposed