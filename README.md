# Vehicle Incidents Management System

A comprehensive incident management system for tracking, reporting, and managing vehicle incidents within a fleet management platform. Built with Next.js 15, Prisma, TanStack Query, and modern TypeScript patterns.

## 🚀 Features

### Core Functionality
- ✅ **Incident Management**: Create, read, update, and track vehicle incidents
- ✅ **Image Upload**: Cloudinary integration for incident documentation
- ✅ **Status Workflow**: Complete incident lifecycle management
- ✅ **Responsive Design**: Desktop table view with mobile-optimized cards
- ✅ **Update Timeline**: Comment system and incident history tracking
- ✅ **Analytics Dashboard**: Real-time statistics and reporting

### Technical Highlights
- **Modern Architecture**: Next.js 15 App Router with TypeScript
- **Database**: Prisma ORM with PostgreSQL (NeonDB)
- **State Management**: TanStack Query for server state
- **UI Components**: Tailwind CSS with reusable component library
- **File Storage**: Cloudinary for image and document management

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (NeonDB), Prisma ORM
- **State Management**: TanStack Query v5
- **File Upload**: Cloudinary
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ 
- pnpm/npm/yarn
- PostgreSQL database (or NeonDB account)
- Cloudinary account for file uploads

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd vehicle-incidents-system
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
├── app/
│   ├── api/incidents/           # API routes
│   │   ├── route.ts            # GET /api/incidents, POST /api/incidents
│   │   ├── [id]/
│   │   │   ├── route.ts        # GET, PUT /api/incidents/[id]
│   │   │   └── updates/
│   │   │       └── route.ts    # POST /api/incidents/[id]/updates
│   │   └── stats/
│   │       └── route.ts        # GET /api/incidents/stats
│   └── fleetmanager/incidents/ # UI pages
│       ├── page.tsx            # Incidents list
│       ├── new/page.tsx        # Create incident
│       ├── [id]/page.tsx       # Incident details
│       ├── [id]/edit/page.tsx  # Edit incident
│       └── stats/page.tsx      # Analytics dashboard
├── components/
│   ├── incidents/              # Incident-specific components
│   │   ├── IncidentsTable.tsx  # Main data table
│   │   ├── IncidentForm.tsx    # Create/edit form
│   │   ├── IncidentDetail.tsx  # Detail view
│   │   ├── IncidentStats.tsx   # Dashboard stats
│   │   └── IncidentCard.tsx    # Mobile card view
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── queries/incidents.ts    # TanStack Query hooks
│   ├── query-keys.ts           # Query key factory
│   ├── api-client.ts           # HTTP client
│   └── validations/incidents.ts # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
└── types/
    └── incidents.ts            # TypeScript types
```

## 🔌 API Endpoints

### Incidents
- `GET /api/incidents` - List incidents with filters
- `POST /api/incidents` - Create new incident
- `GET /api/incidents/[id]` - Get incident details
- `PUT /api/incidents/[id]` - Update incident
- `POST /api/incidents/[id]/updates` - Update
- `GET /api/incidents/stats` - Dashboard statistics
