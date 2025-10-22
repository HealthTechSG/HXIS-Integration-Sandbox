# HXIS Integration Sandbox - NGEMR Development Environment

## Overview

The **Next Generation Electronic Medical Record (NGEMR)** is Singapore’s national Electronic Medical Record platform, built on the Epic EMR system and used across public healthcare institutions. It is the backbone for safe, seamless, and coordinated patient care.

As a live production system, integration with NGEMR follows a well-defined and governed process designed to uphold stability, security, and interoperability across the healthcare ecosystem.
- It is guided by structured approval and review procedures that ensure all integrations meet operational and clinical standards.
- It is supported by established governance frameworks to align with national healthcare policies and data protection requirements.
- It operates on clear technical standards, including HL7, FHIR, and Epic interfaces, to maintain consistency and compatibility.

This structured approach safeguards the reliability of NGEMR while ensuring that any new integration delivers value, complies with standards, and supports the broader vision of a connected healthcare system.

To complement this process and facilitate early innovation, the **EMR Integration Sandbox** provides a production-like environment that simulates NGEMR, allowing innovators to:

- **Experiment and test integrations** without risk to live operations.
- **Validate and refine solutions early** using synthetic data and realistic workflows.
- **Accelerate readiness** for NGEMR integration, reducing rework and delays.

By bridging the gap between innovation and adoption, the EMR Integration Sandbox helps ideas move faster, safer, and more effectively into Singapore’s healthcare ecosystem.

### Purpose

The EMR Integration Sandbox is designed to:

- Provide an overview of NGEMR and the pathway to integrate with it.
- Offer a realistic EMR environment that simulates NGEMR for safe integration testing.
- Enable innovators to trial solutions with production-like interfaces, building confidence before engaging the live system.

### Playbook on EMR integration

This Playbook serves as a practical guide for innovators, outlining the steps to move from idea to production:
1. Introduction to NGEMR – Understanding the national EMR system and its importance.
2. Testing integration in Sandbox – Hands-on testing with preloaded data and standardized protocols (HL7, FHIR).
3. Integration using Epic APIs – Practical pathways using both open and vendor-supported services.
4. Integration with NGEMR in Production – Considerations, processes, and case studies for scaling into the real EMR environment.

For more details, visit **[Our Website](https://innovation.healthx.sg/integration-sandbox-overview)** to explore more information.

## Tech Stack

This sandbox utilizes modern web technologies optimized for healthcare development:

- **[Vite](https://vitejs.dev/)**: Lightning-fast build tool and development server
- **[React 18](https://reactjs.org/)**: Modern UI library with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development with healthcare data models
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first styling for healthcare UIs
- **[Ant Design](https://ant.design/)**: Enterprise-grade UI components for medical applications
- **[React OIDC Context](https://www.npmjs.com/package/react-oidc-context)**: Healthcare-grade authentication
- **[FHIRClient](https://github.com/smart-on-fhir/client-js)**: Standard FHIR R4 API interactions
- **[Redux Toolkit](https://redux-toolkit.js.org/rtk-query/overview)**: State management with RTK Query for API caching and tab management
- **[Zod](https://github.com/colinhacks/zod)**: Runtime type validation for healthcare data integrity
- **[Vitest](https://vitest.dev/)**: Fast unit testing framework

### Target Users

This sandbox is designed for:

- **Healthcare Integration Developers** building NGEMR-connected applications
- **POC/POV Teams** needing realistic data for demonstrations
- **Healthcare IT Consultants** learning Epic FHIR integration patterns
- **Medical Software Vendors** developing NGEMR-compatible solutions
- **Healthcare Startups** prototyping digital health solutions
- **Training Organizations** teaching healthcare interoperability

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [NGEMR Sandbox Features](#2-ngemr-sandbox-features)
3. [Environment Configuration](#3-environment-configuration)
4. [FHIR Resource Coverage](#4-fhir-resource-coverage)
5. [Development Workflow](#5-development-workflow)
6. [Epic API Compatibility](#6-Epic-api-compatibility)
7. [Testing & Validation](#7-testing--validation)
8. [Deployment Options](#8-deployment-options)
9. [POC/POV Use Cases](#9-pocpov-use-cases)
10. [Contributing](#10-contributing)

---

## 1. Getting Started

### Prerequisites

Ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (v18 or later) - Required for modern JavaScript features
- **[Git](https://git-scm.com/)** - Version control for collaboration
- **Basic FHIR Knowledge** - Understanding of healthcare data standards (optional but helpful)

### Installation

1. **Clone the Sandbox Repository**

```bash
git clone https://github.com/HealthTechSG/HXIS-Integration-Sandbox
cd HXIS-Integration-Sandbox
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set Up Environment**

```bash
cp env/.env.development.sample env/.env.development.local
# Edit env/.env.development.local with your sandbox configuration
```

4. **Start the Development Server**

```bash
npm run dev
```

The sandbox will be available at `http://localhost:3000` with a full NGEMR-like interface.

---

## 2. NGEMR Sandbox Features

### Core Capabilities

#### 🏥 **Production-Like Healthcare Data**
- Realistic patient demographics with Singapore-specific data patterns
- Comprehensive medical histories spanning multiple care episodes
- Authentic clinical terminologies (SNOMED CT, ICD-10, LOINC)
- Multi-ethnic patient populations reflecting Singapore demographics

#### 🔗 **Epic API Interface Simulation**
- FHIR R4 compliant endpoints matching Epic patterns
- Realistic API response times and pagination
- Authentication flows similar to production NGEMR
- Error handling patterns consistent with Epic systems

#### 🏢 **Multi-Tenant Healthcare Environment**
- Simulated healthcare organizations and facilities
- Provider hierarchies and departmental structures
- Realistic appointment scheduling across multiple locations
- Cross-facility patient data sharing scenarios

#### 🔍 **Advanced Search & Filtering**
- FHIR-compliant search parameters
- Complex queries with multiple criteria
- Pagination and sorting capabilities
- Real-time search result updates

#### 📑 **Tab-Based Navigation System**
- Browser-like tabbed interface for clinical workflows
- Multi-tab support for patient and practitioner records
- Closable tabs with "×" functionality
- Active tab tracking and state persistence
- Dynamic tab content loading based on resource type

### Healthcare Scenarios Covered

- **Primary Care Visits** - Routine checkups, preventive care, vaccinations
- **Specialist Consultations** - Cardiology, endocrinology, oncology workflows
- **Emergency Department** - Acute care scenarios, triage workflows
- **Chronic Disease Management** - Diabetes, hypertension, heart disease tracking
- **Laboratory Integration** - Lab orders, results reporting, critical value alerts
- **Medication Management** - Prescription workflows, drug interaction checks
- **Preventive Care** - Screening programs, health maintenance

### Advanced UI Features

#### **Tab-Based Navigation System**
The sandbox implements a sophisticated tab-based navigation system for enhanced clinical workflows:

- **Multi-Resource Tabs**: Open multiple Patient and Practitioner records simultaneously
- **Browser-Like Experience**: Familiar tabbed interface with closable tabs
- **State Management**: Tab state persistence through Redux for consistent user experience
- **Dynamic Content Loading**: Tabs load content dynamically based on resource type and ID
- **SideMenu Integration**: SideMenu items now open tabs instead of traditional page navigation

**Tab Types Supported:**
- Patient List Tab - Browse and search patient records
- Patient Profile Tab - Detailed patient information with specific resource ID
- Practitioner List Tab - Browse and search healthcare provider records
- Practitioner Profile Tab - Detailed practitioner information with specific resource ID

#### **Comprehensive Practitioner Management**
Full-featured practitioner management system mirroring the patient management capabilities:

**Core Features:**
- **FHIR R4B Compliant**: Complete Practitioner resource support with proper FHIR structure
- **Full CRUD Operations**: Create, Read, Update, Delete practitioner records
- **Professional Specialties**: 16 predefined medical specialties with custom entry support
- **Advanced Form System**: Multi-section registration form with validation
- **Search & Filter**: FHIR-compliant search with multiple criteria

**Supported Specialties:**
Internal Medicine, Cardiology, Emergency Medicine, Family Medicine, Pediatrics, Surgery, Orthopedics, Neurology, Psychiatry, Radiology, Anesthesiology, Pathology, Medical Doctor, Certified Nurse Practitioner, Registered Nurse, Physical Therapist

**Form Sections:**
- Name Information (Given Name, Family Name)
- Basic Information (Birth Date, Gender, Active Status)
- Contact Information (Work Phone, Work Email)
- Address Information (Full address with city, state, postal code, country)
- Professional Qualification (Primary specialty with custom entry support)

---

## 3. Environment Configuration

The sandbox uses environment-specific configurations to simulate different NGEMR deployment scenarios.

### Development Environment Setup

```bash
# Copy and customize environment file
cp env/.env.development.sample env/.env.development.local
```

### Key Configuration Variables

```plaintext
# Sandbox Application Configuration
VITE_APP_TITLE='NGEMR Integration Sandbox'
VITE_APP_BASE_URL='/sandbox'
VITE_APP_ID='ngemr-sandbox-001'

# Mock FHIR API Configuration  
VITE_FHIR_API_BASE_URL='http://localhost:3000/api/fhir/r4'
VITE_FHIR_API_KEY='sandbox-api-key'

# Sandbox Authentication (for development)
VITE_OIDC_AUTHORITY='http://localhost:3000/auth'
VITE_OIDC_CLIENT_ID='ngemr-sandbox-client'
VITE_OIDC_REDIRECT_URI='http://localhost:3000/sandbox/callback'

# Optional: SmartOnFHIR Testing
VITE_SMART_LAUNCH_TOKEN_URL='http://localhost:3000/auth/smart/launch'
VITE_SMART_APP_BASE_URL='http://localhost:3000/smart-apps'
VITE_SMART_FHIR_RESOURCE_BASE_URL='http://localhost:3000/api/fhir/r4'
```

### Environment Validation

All environment variables are validated at build time using Zod schemas to ensure data integrity and prevent configuration errors common in healthcare applications.

---

## 4. FHIR Resource Coverage

The sandbox provides comprehensive coverage of NGEMR-relevant FHIR resources:

### Core Patient Data
- **Patient** - Demographics, identifiers, contact information, emergency contacts
- **RelatedPerson** - Next of kin, caregivers, emergency contacts
- **Practitioner** - Healthcare providers with full CRUD operations, 16 predefined specialties, custom specialty support
- **PractitionerRole** - Provider assignments, schedules, locations

### Clinical Data
- **Observation** - Vital signs, lab results, clinical measurements, scores
- **Condition** - Diagnoses, problems, medical conditions with severity
- **Procedure** - Surgeries, treatments, interventions with outcomes
- **MedicationRequest** - Prescriptions, dosing, administration instructions
- **MedicationStatement** - Current medications, adherence, effectiveness
- **AllergyIntolerance** - Drug allergies, environmental sensitivities, reactions

### Care Coordination
- **Encounter** - Hospital visits, consultations, care episodes
- **Appointment** - Scheduling, provider availability, patient preferences
- **CarePlan** - Treatment plans, goals, care team coordination
- **ServiceRequest** - Lab orders, referrals, diagnostic requests

### Administrative
- **Organization** - Hospitals, clinics, departments, care networks
- **Location** - Facilities, rooms, service areas
- **Coverage** - Insurance, health plans, authorization
- **Account** - Billing, financial responsibility

---

## 5. Development Workflow

### Core Development Commands

```bash
# Start development server with hot reloading
npm run dev

# Build for testing/staging
npm run build

# Run comprehensive test suite
npm run test

# Type checking and linting
npm run type-check
npm run lint

# Format code to healthcare standards
npm run format
```

### Feature Development Process

1. **Create NGEMR Feature Module**
   ```bash
   mkdir -p src/features/[ResourceName]/{components,hooks,services,types}
   ```

2. **Implement FHIR Service**
   ```typescript
   // src/services/[Resource]/[Resource]Service.ts
   export const resourceApi = createApi({
     endpoints: (builder) => ({
       getResourceList: builder.query(),
       createResource: builder.mutation(),
       updateResource: builder.mutation(),
       deleteResource: builder.mutation(),
     })
   });
   ```

3. **Add Tab Integration** (for new FHIR resources)
   ```typescript
   // Update src/common/hooks/useTabs.ts
   export const useResourceTabs = () => ({
     openResourceListTab: () => { /* Implementation */ },
     openResourceProfileTab: (id: string, name: string) => { /* Implementation */ }
   });
   ```

4. **Add Mock Data Generator**
   ```typescript
   // Generate realistic healthcare data
   export const generateMockPatients = (count: number) => { ... }
   ```

5. **Create UI Components**
   ```typescript
   // Healthcare-specific UI patterns with tab support
   export const ResourceListPage = () => { /* Tab-enabled list view */ }
   export const ResourceProfilePage = () => { /* Tab-enabled detail view */ }
   ```

6. **Write Integration Tests**
   ```typescript
   // Test FHIR compliance and data integrity
   describe('Patient Service', () => { ... })
   ```

---

## 6. Epic API Compatibility

### API Response Patterns

The sandbox mimics Epic's specific FHIR implementation patterns:

```typescript
// Epic-style Bundle response
{
  "resourceType": "Bundle",
  "id": "Epic-search-result",
  "type": "searchset",
  "total": 150,
  "link": [
    {
      "relation": "self",
      "url": "Patient?_count=20&_offset=0"
    }
  ],
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "Epic-patient-123",
        "identifier": [
          {
            "system": "urn:oid:2.16.840.1.113883.3.42.10001.100001.12",
            "value": "NRIC123456789"
          }
        ]
        // ... rest of patient data
      }
    }
  ]
}
```

### Authentication Flow

```typescript
// Epic OAuth2 flow simulation
const authenticateWithEpic = async () => {
  const response = await fetch('/auth/Epic/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=patient/*.read'
  });
  return response.json();
};
```

### Search Parameters

Epic-compatible search patterns:
```typescript
// Complex patient search
const searchPatients = {
  'given': 'John',
  'family': 'Doe',
  'identifier': 'NRIC|S1234567A',
  '_count': '50',
  '_offset': '0'
};
```

---

## 7. Testing & Validation

### Test Strategy

```bash
# Run all tests including FHIR validation
npm run test

# Generate coverage report
npm run test:coverage

# Run FHIR resource validation
npm run test:fhir-validation
```

### FHIR Compliance Testing

The sandbox includes comprehensive FHIR validation:

```typescript
import { validateFhirResource } from '@/utils/fhir-validation';

test('Patient resource complies with FHIR R4', () => {
  const patient = generateMockPatient();
  const validation = validateFhirResource(patient, 'Patient');
  expect(validation.isValid).toBe(true);
});
```

### Integration Testing Scenarios

- **Patient Registration Flow** - Complete patient onboarding
- **Clinical Data Exchange** - Lab results, observations, conditions
- **Appointment Management** - Scheduling, modifications, cancellations
- **Medication Workflows** - Prescriptions, dispensing, administration
- **Emergency Care** - Acute care scenarios with complete data sets

---

## 8. Deployment Options

### Local Development
```bash
npm run dev
# Sandbox available at http://localhost:3000
```

### Shared Team Environment
```bash
npm run build-staging
# Deploy to shared staging environment for team collaboration
```

### Demo/Presentation Environment
```bash
npm run build-production
# Production-optimized build for stakeholder demonstrations
```

### Deployment to Developer Portal
```bash
npm run build

# Install zip comment for WSL if not available
sudo apt install zip

# Zip the built dist folder
zip -r dist.zip dist

# Upload to Developer Portal
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 9. POC/POV Use Cases

### Proof-of-Concept Scenarios

#### **Clinical Decision Support Integration**
- Implement drug interaction checking against NGEMR medication data
- Test clinical alerts and recommendations workflows using tab-based UI
- Validate care gap identification algorithms with multi-patient tab views

#### **Population Health Analytics**
- Aggregate patient data across demographics and conditions
- Test chronic disease management dashboards
- Validate public health reporting mechanisms

#### **Mobile Health App Integration**
- Connect patient-facing apps to NGEMR data
- Test remote monitoring data ingestion
- Validate patient portal functionality

### Proof-of-Value Demonstrations

#### **Workflow Optimization**
- Demonstrate reduced clinical documentation time with tab-based navigation
- Show improved care coordination between providers using practitioner management
- Quantify medication reconciliation improvements with multi-resource tab views

#### **Clinical Outcomes**
- Track patient outcome improvements with new tools
- Measure care quality indicators and metrics
- Demonstrate population health improvements

#### **Operational Efficiency**
- Show reduced duplicate testing and procedures
- Measure appointment scheduling optimization
- Quantify administrative burden reduction

---

## 10. Contributing

### Contributing to NGEMR Sandbox

We welcome contributions that enhance the sandbox's realism and utility for NGEMR integration development.

#### **Priority Contribution Areas**
- **New FHIR Resources** - Additional healthcare data types
- **Singapore-Specific Patterns** - Local healthcare system nuances  
- **Epic API Updates** - Latest Epic FHIR implementation patterns
- **Clinical Scenarios** - More realistic healthcare workflows
- **Testing Utilities** - Enhanced validation and testing tools

#### **Contribution Guidelines**
1. **Healthcare Data Accuracy** - Ensure medical accuracy in mock data
2. **FHIR Compliance** - Maintain strict FHIR R4 compliance
3. **Singapore Context** - Reflect local healthcare patterns and regulations
4. **Documentation** - Comprehensive documentation for new features
5. **Testing** - Include tests for all new functionality

#### **Getting Started with Contributions**
```bash
# Fork and clone the repository
git clone https://github.com/your-username/HXIS-Integration-Sandbox
cd HXIS-Integration-Sandbox

# Create feature branch
git checkout -b feature/new-fhir-resource

# Make changes and test
npm run test
npm run lint

# Submit pull request with detailed description
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Documentation

- **Technical Support**: Open an issue on GitHub for technical questions
- **Healthcare Integration Guidance**: Refer to FHIR R4 documentation and Epic implementation guides
- **Training Materials**: Additional tutorials and examples available in `/docs` directory
- **Community**: Join our healthcare developer community for best practices and collaboration

---

*The HXIS Integration Sandbox is a development tool designed to accelerate NGEMR integration projects. It provides realistic healthcare data and Epic-compatible APIs for safe development and testing environments.*