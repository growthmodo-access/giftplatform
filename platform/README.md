# Goodies.so Platform - Employee Gifting Platform

A modern employee gifting and swag management platform built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎁 **Product Management** - Manage swag, gift cards, and physical gifts
- 📦 **Order Management** - Track and manage gift orders
- 👥 **Employee Management** - Manage team members and their gift history
- ⚡ **Automation** - Automated gift campaigns for new hires, birthdays, anniversaries
- 📊 **Analytics** - Detailed insights and reports
- 🔐 **Authentication** - Secure authentication with Supabase Auth
- 🎨 **Modern UI** - Clean, white design with premium color palette and gradients

## Color Scheme

The application uses a premium color palette with white as the base. All colors are defined in `app/globals.css` as CSS variables.

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **White (Base)** | `#FFFFFF` | `255, 255, 255` | Main background throughout the app |
| **Signal Black** | `#282828` | `40, 40, 40` | Primary text color |
| **Amethyst Bellflower** | `#7B61FF` | `123, 97, 255` | Primary buttons, active states, main accents |
| **Azure Cornflower** | `#2883EB` | `40, 131, 235` | Secondary accents, gradient combinations |
| **Creamy Milk** | `#F8F3EC` | `248, 243, 236` | Backgrounds, borders, subtle accents |
| **Watermelon with Carrot** | `#FF5E54` | `255, 94, 84` | Destructive/error states |
| **Light Malachite** | `#28BF5D` | `40, 191, 93` | Success states |
| **Lemon and Banana** | `#FFE450` | `255, 228, 80` | Secondary highlights, warm gradients |

### Gradient Combinations

- **Primary Gradient**: `#7B61FF` → `#2883EB` (Amethyst to Azure) - Main buttons
- **Warm Gradient**: `#FFE450` → `#FF5E54` (Lemon to Watermelon) - Warm accents
- **Cool Gradient**: `#2883EB` → `#28BF5D` (Azure to Malachite) - Cool accents
- **Vibrant Gradient**: `#7B61FF` → `#FF5E54` → `#FFE450` - Multi-color gradients
- **Subtle Gradient**: `#FFFFFF` → `#F8F3EC` → `#FFFFFF` - Background gradients

### Usage Guidelines

- **Primary Actions**: Use Amethyst Bellflower (`#7B61FF`) for main CTAs and buttons
- **Secondary Actions**: Use Azure Cornflower (`#2883EB`) for secondary buttons
- **Backgrounds**: Use White (`#FFFFFF`) as base with Creamy Milk (`#F8F3EC`) for subtle sections
- **Borders**: Use Creamy Milk (`#F8F3EC`) with opacity variations (e.g., `#F8F3EC/50`)
- **Text**: Use Signal Black (`#282828`) for primary text, muted colors for secondary text
- **Success States**: Use Light Malachite (`#28BF5D`)
- **Error States**: Use Watermelon with Carrot (`#FF5E54`)
- **Active States**: Use Amethyst Bellflower (`#7B61FF`) with Creamy Milk (`#F8F3EC`) background

### CSS Variables

All colors are available as CSS variables in `app/globals.css`:
- `--color-creamy-milk: #F8F3EC`
- `--color-watermelon: #FF5E54`
- `--color-malachite: #28BF5D`
- `--color-azure: #2883EB`
- `--color-lemon: #FFE450`
- `--color-amethyst: #7B61FF`
- `--color-signal-black: #282828`

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

7. Open [http://localhost:3000](http://localhost:3000) in your browser (local development) or visit [https://goodies.so](https://goodies.so) (production)

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
