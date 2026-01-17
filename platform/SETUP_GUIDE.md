# Setup Guide - Goodies.so Platform

This guide will help you set up and run the Goodies.so platform application.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- A Supabase account (free tier works)

## Step 1: Install Dependencies

Navigate to the platform directory and install all dependencies:

```bash
cd platform
npm install
```

## Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be fully provisioned

2. **Get Your Supabase Credentials**
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon/public` key

3. **Set Up the Database**
   - Go to SQL Editor in your Supabase dashboard
   - Open `SUPABASE_SETUP.md` in this project
   - Copy the SQL migration script
   - Paste and run it in the SQL Editor
   - Verify tables are created in the Table Editor

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the `platform` directory:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** Never commit `.env.local` to version control!

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000) (local development) or [https://goodies.so](https://goodies.so) (production)

## Step 5: Create Your First Account

1. Navigate to `/signup`
2. Create an account with your email and password
3. You'll be automatically logged in and redirected to the dashboard

## Project Structure

```
platform/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── products/         # Product-related components
├── lib/                  # Utility functions
│   └── supabase/        # Supabase client setup
├── types/                # TypeScript type definitions
├── actions/              # Server Actions (Next.js 15)
└── public/               # Static assets
```

## Available Pages

- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Main dashboard with stats
- `/products` - Product management
- `/orders` - Order management
- `/employees` - Employee management
- `/gifts` - Gift tracking
- `/automation` - Automated campaigns
- `/analytics` - Analytics and reports
- `/settings` - Account settings

## Features Implemented

✅ **Authentication**
- User signup and login
- Protected routes with middleware
- Session management

✅ **Dashboard**
- Stats cards with metrics
- Recent orders display
- Top products list
- Sales chart placeholder

✅ **Product Management**
- Product listing table
- Search and filter functionality
- Status badges
- Inventory tracking

✅ **Other Pages**
- Orders management
- Employee management
- Automation campaigns
- Analytics dashboard
- Settings page

## Next Steps

1. **Add Real Data**: Connect to your actual Supabase database
2. **Implement Charts**: Add a charting library (e.g., Recharts) for analytics
3. **Add Forms**: Create product creation/editing forms
4. **File Uploads**: Set up Supabase Storage for product images
5. **Email Notifications**: Integrate email service for gift notifications
6. **Real-time Updates**: Use Supabase real-time subscriptions

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Make sure all dependencies are installed:
```bash
npm install
```

### Issue: Supabase connection errors
**Solution:** 
- Verify your `.env.local` file has correct credentials
- Check that your Supabase project is active
- Ensure the database tables are created

### Issue: Authentication not working
**Solution:**
- Check Supabase Auth settings
- Verify email confirmation is disabled for development (or confirm your email)
- Check browser console for errors

### Issue: TypeScript errors
**Solution:**
- Run `npm run type-check` to see all errors
- Make sure all types are properly imported
- Check that `tsconfig.json` is correct

## Development Tips

1. **Use Turbopack**: The dev server uses Turbopack by default for faster builds
2. **Hot Reload**: Changes to components will automatically reload
3. **Type Safety**: TypeScript will catch errors during development
4. **Server Components**: Most pages use Server Components for better performance

## Production Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Start production server:**
```bash
npm start
```

3. **Deploy to Vercel** (recommended):
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

## Support

For issues or questions:
- Check the README.md
- Review Supabase documentation
- Check Next.js 15 documentation
