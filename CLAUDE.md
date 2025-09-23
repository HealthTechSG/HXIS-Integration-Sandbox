# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (runs on port 3000)
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run preview` - Preview production build locally
- `npm test` - Run tests with Vitest
- `npm run test:coverage` - Run tests with coverage report

### Code Quality & Linting
- `npm run lint` - Run ESLint on src directory
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking without emitting files
- `npm run analyze` - Analyze bundle size with source-map-explorer

### Environment-Specific Builds
- `npm run staging` - Run development server in staging mode
- `npm run build-staging` - Build for staging environment
- `npm run production` - Run development server in production mode  
- `npm run build-production` - Build for production environment

## Architecture Overview

This is the **HXIS Integration Sandbox** - a React-based application that provides a sandbox environment for National Group Electronic Medical Record (NGEMR) integration development. This application serves as a production-like mockup of NGEMR data and EPIC API interfaces, enabling developers to build and test their integrations during Proof-of-Concept (POC) and Proof-of-Value (POV) phases without requiring direct access to production NGEMR systems. The codebase follows a **feature-based architecture** to promote maintainability and scalability.

### Key Technologies
- **Vite** - Fast build tool and dev server
- **React 18** with TypeScript
- **Ant Design** - UI component library
- **Redux Toolkit** with RTK Query for state management
- **React Router** for navigation with **Tab-based UI System**
- **React OIDC Context** for authentication
- **FHIRClient** for FHIR API interactions
- **Tailwind CSS** for styling
- **Vitest** for testing

### Project Structure

```
src/
├── app/                    # Core app setup and providers
├── features/              # NGEMR feature modules (Patient, Practitioner, Observation, etc.)
├── common/                # Shared components, hooks, utilities (includes TabContainer)
├── services/              # FHIR API services and EPIC-like mock services
├── redux/                 # Redux store and slices (includes tab management)
├── configs/               # Configuration files and theme
├── i18n/                  # Internationalization
├── assets/                # Static assets
└── utils/                 # Utility functions
```

### Feature Architecture
Each feature follows a consistent structure:
```
features/[FeatureName]/
├── components/            # Feature-specific components
├── hooks/                 # Feature-specific hooks
├── constants/             # Feature constants and labels
├── routes/                # Feature routes
└── index.ts               # Feature exports
```

## Environment Configuration

Environment variables are strictly validated using Zod schemas in `env.config.ts`. The app supports multiple environments (development, staging, production) with environment files stored in the `env/` directory.

### Required Environment Variables
- `VITE_APP_TITLE` - Application title
- `VITE_APP_ID` - Unique app identifier (UUID)
- `VITE_APP_BASE_URL` - Base URL (automatically set to "/apps" in production)
- `VITE_FHIR_API_BASE_URL` - FHIR API endpoint
- `VITE_FHIR_API_KEY` - FHIR API access key
- `VITE_OIDC_AUTHORITY` - OIDC provider URL
- `VITE_OIDC_CLIENT_ID` - OIDC client identifier
- `VITE_OIDC_REDIRECT_URI` - OIDC redirect URI

### SmartOnFHIR Variables (Optional)
- `VITE_SMART_LAUNCH_TOKEN_URL` - Smart launch token endpoint
- `VITE_SMART_APP_BASE_URL` - Smart app base URL
- `VITE_SMART_FHIR_RESOURCE_BASE_URL` - Smart FHIR resource endpoint

## Authentication System

The app uses **OpenID Connect (OIDC)** via `react-oidc-context` for authentication. All protected routes are wrapped with the `ProtectedRoute` component located at `src/common/components/ProtectedRoute.tsx`.

### Key Authentication Components
- `AuthProvider` - Configured in `App.tsx` with OIDC settings
- `ProtectedRoute` - HOC for route protection
- `useAuth` hook - Access authentication state throughout the app

## FHIR Integration & NGEMR Sandbox

The application provides a comprehensive sandbox environment that mimics NGEMR's EPIC API interface through:
- **FHIRClient library** for standard FHIR R4 operations
- **Mock EPIC-like services** in `src/services/` simulating production NGEMR data
- **Production-like FHIR resources**: Patient, Observation, AllergyIntolerance, Appointment, Practitioner, Organization
- **Mapper utilities** for transforming FHIR resources to app-specific types
- **Redux RTK Query** for API state management with realistic data patterns

### NGEMR Resource Coverage
The sandbox includes mock data and interfaces for key NGEMR FHIR resources:
- **Patient** - Demographics, identifiers, contact information
- **Observation** - Lab results, vital signs, clinical measurements  
- **AllergyIntolerance** - Patient allergies and adverse reactions
- **Appointment** - Scheduling and appointment management
- **Practitioner** - Healthcare provider information
- **Organization** - Healthcare facilities and departments
- **Encounter** - Patient visits and care episodes
- **Medication** - Prescriptions and medication management
- **Condition** - Diagnoses and medical conditions
- **Procedure** - Medical procedures and interventions

### Service Structure
Each NGEMR feature has its own service module:
- `[Feature]Service.ts` - EPIC-like API interaction logic with realistic data
- `[Feature]Types.ts` - TypeScript type definitions matching NGEMR patterns
- `[Feature]MapperUtil.ts` - Data transformation utilities for FHIR compliance
- `Fhir[Feature]Types.ts` - FHIR-specific type definitions for R4 compatibility

## Testing Strategy

- **Vitest** for unit testing with jsdom environment
- Test files use `.test.tsx` or `.test.ts` extensions
- Coverage reporting with v8 provider
- Tests located alongside source files in feature directories

## Code Quality Standards

### ESLint Configuration
- Extends Airbnb TypeScript configuration
- Tailwind CSS plugin for utility class linting
- Import ordering rules with alphabetical sorting
- React-specific rules for component patterns
- Custom rules for destructuring key sorting

### Key Patterns
- Arrow function components preferred
- JSX props should be sorted
- Destructured keys should be alphabetically sorted
- Import statements grouped and alphabetized
- No default exports required (prefer named exports)

## SmartOnFHIR Integration

The app supports launching external Smart Apps through the SmartOnFHIR protocol. This enables embedding healthcare applications that can access patient data through standardized FHIR APIs.

### Implementation
- `SmartApp` component handles Smart App embedding
- Token-based authentication for Smart App launches
- Context passing for patient and session information
- Single sign-on capabilities between apps

## Development Guidelines for NGEMR Integration

1. **NGEMR Feature Development**: Create new FHIR resource features following the established directory structure
2. **Mock Data Creation**: Generate realistic healthcare data that mirrors production NGEMR patterns
3. **EPIC API Compatibility**: Ensure service interfaces match EPIC FHIR API patterns and responses
4. **Environment Setup**: Copy environment samples from `env/` directory and configure for sandbox use
5. **Type Safety**: All environment variables are validated at build time using Zod schemas
6. **Authentication**: Use `ProtectedRoute` wrapper for any routes requiring authentication
7. **FHIR Compliance**: Use the service layer and mapper utilities for FHIR R4 compliant resource handling
8. **Styling**: Follow Tailwind CSS utility-first approach with Ant Design components for healthcare UIs
9. **State Management**: Use Redux Toolkit with RTK Query for API state management with realistic latency simulation

## NGEMR Sandbox Features

### Core Capabilities
- **Production-like Data**: Realistic patient demographics, medical histories, and clinical data
- **EPIC Interface Simulation**: API responses that match EPIC FHIR patterns used by NGEMR
- **Multi-tenant Support**: Simulated healthcare organization and facility structures
- **Search & Filter**: FHIR-compliant search parameters and result pagination
- **Real-time Updates**: Simulated real-time clinical data updates and notifications
- **Integration Testing**: Comprehensive test scenarios for POC/POV validation

### Use Cases
- **Developer Onboarding**: Learn NGEMR integration patterns without production access
- **POC Development**: Build proof-of-concept integrations with realistic data
- **POV Demonstrations**: Showcase integration capabilities to stakeholders
- **Testing & QA**: Validate integration logic before production deployment
- **Training**: Healthcare IT training on FHIR and EPIC integration patterns

## Tab Navigation System

The application implements a sophisticated tab-based navigation system that transforms traditional routing into a browser-like tabbed interface for enhanced user experience in clinical workflows.

### Key Components
- **TabContainer** (`src/common/components/TabContainer/TabContainer.tsx`) - Main tab container rendering active tabs with closable functionality
- **Tab Redux Slice** (`src/redux/slice/tabs.ts`) - State management for tab operations (add, remove, activate, update)
- **useTabs Hook** (`src/common/hooks/useTabs.ts`) - Centralized tab operations for different FHIR resources

### Tab Management Features
- **Multi-tab Support**: Open multiple Patient/Practitioner records simultaneously
- **Closable Tabs**: Each tab includes a "×" button for easy closure
- **Active Tab Tracking**: Visual indication of currently active tab
- **Dynamic Tab Content**: Tabs dynamically load content based on resource type and ID
- **Tab Persistence**: Tab state managed through Redux for consistency

### Supported Tab Types
- **Patient List Tab**: Browse and search patient records
- **Patient Profile Tab**: View detailed patient information with resource ID
- **Practitioner List Tab**: Browse and search practitioner records  
- **Practitioner Profile Tab**: View detailed practitioner information with resource ID

### Tab Integration with SideMenu
- SideMenu items now open tabs instead of traditional route navigation
- Clicking "Patient List" opens a new patient list tab
- Clicking "Practitioner List" opens a new practitioner list tab
- "View Profile" buttons create dedicated profile tabs for specific resources

### Tab State Structure
```typescript
interface TabItem {
  key: string;                    // Unique tab identifier
  label: string;                  // Display name in tab
  content: React.ReactNode;       // Tab content component
  closable?: boolean;             // Whether tab can be closed (default: true)
  resourceType?: 'Patient' | 'Practitioner';  // FHIR resource type
  resourceId?: string;            // Specific resource ID for profile tabs
}
```

### Usage Example
```typescript
// Open a patient profile tab
const { openPatientProfileTab } = useTabs();
openPatientProfileTab(patient.id, patient.name);

// Open practitioner list tab
const { openPractitionerListTab } = useTabs();
openPractitionerListTab();
```

## Practitioner Management Feature

The application includes comprehensive Practitioner management capabilities that mirror the Patient management system, providing full FHIR R4B compliance for healthcare provider data.

### Key Components
- **PractitionerListPage** (`src/features/Practitioner/components/PractitionerListPage.tsx`) - Main practitioner search and management interface
- **PractitionerTable** (`src/features/Practitioner/components/PractitionerTable.tsx`) - Data table for practitioner listings
- **PractitionerService** (`src/services/Practitioner/PractitionerService.ts`) - RTK Query API service for FHIR operations
- **PractitionerMapperUtil** (`src/services/Practitioner/PractitionerMapperUtil.ts`) - FHIR data transformation utilities

### FHIR Practitioner Support
The Practitioner feature provides complete FHIR R4B Practitioner resource support:
- **Demographics**: Name, gender, birth date, contact information
- **Professional Information**: Specialties, qualifications, active status
- **Address Management**: Full address with city, state, postal code, country
- **Identifiers**: System identifiers for practitioner records
- **Communication**: Phone numbers, email addresses

### Practitioner CRUD Operations
- **Create Practitioner**: Full practitioner registration with FHIR-compliant form
- **Read Practitioner**: Retrieve individual or list of practitioners
- **Update Practitioner**: Edit existing practitioner information
- **Delete Practitioner**: Remove practitioner records
- **Search Practitioners**: Query practitioners by name, specialty, or other criteria

### Professional Qualification Management
- **16 Predefined Specialties**: Internal Medicine, Cardiology, Emergency Medicine, Family Medicine, Pediatrics, Surgery, Orthopedics, Neurology, Psychiatry, Radiology, Anesthesiology, Pathology, Medical Doctor, Certified Nurse Practitioner, Registered Nurse, Physical Therapist
- **Custom Specialty Support**: Users can enter custom specialties by typing and pressing Enter
- **Single Selection**: Restricted to one primary specialty per practitioner
- **FHIR Code Mapping**: Automatic mapping to appropriate FHIR specialty codes

### Form Features
- **Multi-section Layout**: Name Information, Basic Information, Contact Information, Address Information, Professional Qualification
- **Validation Rules**: Required fields, email format, phone number format validation
- **Dynamic Form Handling**: Create vs. Edit mode with pre-populated fields
- **Real-time Feedback**: Loading states, success/error messages
- **FHIR Schema Compliance**: Form data transformation to match FHIR Practitioner resource structure

### Service Architecture
```typescript
// RTK Query endpoints
const practitionerApi = createApi({
  endpoints: (builder) => ({
    getPractitionerList: builder.query<GetPractitionerListResponse, GetPractitionerListRequest>(),
    getPractitionerById: builder.query<Practitioner, string>(),
    createPractitioner: builder.mutation<Practitioner, CreatePractitionerRequest>(),
    updatePractitioner: builder.mutation<Practitioner, CreatePractitionerRequest & { id: string }>(),
    deletePractitioner: builder.mutation<void, string>(),
    searchPractitioners: builder.query<GetPractitionerListResponse, SearchPractitionersRequest>(),
  })
});
```

### Data Transformation
The PractitionerMapperUtil handles bidirectional transformation:
- **FHIR → App**: Transform FHIR Practitioner resources to application-specific types
- **App → FHIR**: Transform form data to FHIR-compliant Practitioner resources
- **Specialty Mapping**: Convert between display names and FHIR specialty codes
- **Address Handling**: Manage FHIR Address structure with multiple address lines
- **Name Processing**: Handle FHIR HumanName structure with given and family names

## Routing System Architecture

The application uses a sophisticated routing system built on React Router with automatic layout wrapping and feature-based organization.

### Core Routing Components
- **RouterProvider** (`src/app/providers/RouterProvider.tsx`) - Main entry point that creates React Router with wrapped routes
- **RouterUtils** (`src/app/utils/RouterUtils.tsx`) - Automatically wraps routes with layouts based on `handle.layout` property
- **BasePageRouteObject** (`src/common/types/routes/BasePageRouteObject.tsx`) - Extended route type with layout and metadata support

### Layout System
Routes are automatically wrapped with layouts based on their `handle.layout` property:

- **`'private'`** → `PrivateRootLayout` - Full layout with collapsible sidebar, header, blue background
- **`'public'`** → `PublicRootLayout` - Header only, no sidebar
- **`'login'`** → `LoginLayout` - Header with padding for login pages
- **No layout specified** → `RootLayout` - Default layout with sidebar and header
- **`noWrap: true`** → No layout wrapper (used for redirects)

### Route Organization Structure
Routes follow a feature-based organization pattern:

```
src/features/routes.ts (main route registry)
├── src/features/[Feature]/routes/[Feature]Routes.tsx (feature routes)
├── src/features/[Feature]/index.ts (exports)
└── src/configs/navigation/RouteMap.ts (route path definitions)
```

### Adding New Routes

1. **Define route paths** in `src/configs/navigation/RouteMap.ts`:
```typescript
NewFeaturePaths: {
  NewFeatureList: '/new-feature',
  NewFeatureDetail: '/new-feature/:id',
},
```

2. **Create route file** `src/features/NewFeature/routes/NewFeatureRoutes.tsx`:
```typescript
import { BasePageRouteObject } from '@/common/types';
import { RouteMap } from '@/configs';
import { NewFeaturePage } from '../components';
import PrivateRoute from '@/common/components/PrivateRoute';

const NewFeatureRoutes: BasePageRouteObject[] = [
  {
    path: RouteMap.NewFeaturePaths.NewFeatureList,
    element: (
      <PrivateRoute>
        <NewFeaturePage />
      </PrivateRoute>
    ),
    handle: {
      pageTitle: 'New Feature',
      breadcrumbs: [{ title: 'New Feature' }],
      layout: 'private', // 'public', 'login', or undefined
    },
  },
];

export default NewFeatureRoutes;
```

3. **Export routes** in `src/features/NewFeature/index.ts`:
```typescript
export { default as NewFeatureRoutes } from './routes/NewFeatureRoutes';
```

4. **Register in main routes** `src/features/routes.ts`:
```typescript
import { NewFeatureRoutes } from './NewFeature';

const ROUTES: BasePageRouteObject[] = [
  ...LoginRoutes,
  ...HomeRoutes,
  ...PatientRoutes,
  ...NewFeatureRoutes, // Add here
];
```

### Route Protection
- **Private routes**: Wrap with `<PrivateRoute>` for authenticated users
- **Public routes**: Wrap with `<PublicRoute>` for unauthenticated access
- **Protected routes**: Use `<ProtectedRoute>` for role-based access

### Route Metadata
Routes support metadata through the `handle` property:
- `pageTitle` - Page title for browser tab
- `breadcrumbs` - Navigation breadcrumb trail
- `layout` - Layout wrapper selection
- `noWrap` - Skip layout wrapping entirely

### Editing/Removing Routes
- **Change path**: Update `src/configs/navigation/RouteMap.ts`
- **Change layout**: Modify `handle.layout` in route definition
- **Remove routes**: Delete from `src/features/routes.ts` and cleanup feature files

## Deployment

The sandbox can be deployed in multiple environments:
1. **Local Development**: `npm run dev` for individual developer testing
2. **Shared Sandbox**: Deploy to staging environment for team collaboration
3. **Demo Environment**: Production-like deployment for stakeholder demonstrations
4. **HealthX Platform**: Deploy via HealthX User Apps Platform for integrated testing