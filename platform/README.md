# Goodies.so Platform - Employee Gifting Platform

A modern employee gifting and swag management platform built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎁 **Product Management** - Manage swag, gift cards, and physical gifts
- 📦 **Order Management** - Track and manage gift orders
- 👥 **Employee Management** - Manage team members and their gift history
- ⚡ **Automation** - Automated gift campaigns for new hires, birthdays, anniversaries
- 📊 **Analytics** - Detailed insights and reports
- 🔐 **Authentication** - Secure authentication with Supabase Auth
- 🎨 **Modern UI** - Clean, white design with glassmorphism effects

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database and authentication
- **shadcn/ui** - UI components
- **React Query** - Data fetching
- **Zustand** - State management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
cd platform
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Set up the database:
   - Go to your Supabase project
   - Run the SQL migration in the SQL Editor (see `SUPABASE_SETUP.md`)

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
platform/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   └── products/         # Product components
├── lib/                  # Utility functions
│   └── supabase/        # Supabase clients
├── types/                # TypeScript types
├── actions/              # Server Actions
└── public/               # Static assets
```

## Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:
- `users` - User accounts
- `companies` - Company information
- `products` - Gift products
- `orders` - Gift orders
- `order_items` - Order line items
- `gifts` - Gift records
- `campaigns` - Automation campaigns
- `warehouses` - Warehouse locations
- `addresses` - Shipping addresses

## Features in Development

- [ ] Real-time updates
- [ ] Advanced analytics charts
- [ ] Email notifications
- [ ] Multi-warehouse support
- [ ] Gift card redemption
- [ ] Mobile app

## License

MIT
