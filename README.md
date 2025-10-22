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
- **[FHIRClient](https://github.com/smart-on-fhir/client-js)**: Standard FHIR API interactions
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
2. [Environment Configuration](#2-environment-configuration)
3. [Development Workflow](#3-development-workflow)
4. [Epic API Compatibility](#4-Epic-api-compatibility)
5. [Deployment Options](#5-deployment-options)

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

## 2. Environment Configuration

The sandbox uses environment-specific configurations to simulate different NGEMR deployment scenarios.

### Development Environment Setup

```bash
# Copy and customize environment file
cp env/.env.development.sample env/.env.development.local
```

## 3. Development Workflow

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

## 4. Epic API Compatibility

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

## 5. Deployment Options

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Documentation

- **Technical Support**: Open an issue on GitHub for technical questions
- **Healthcare Integration Guidance**: Refer to FHIR documentation and Epic implementation guides
- **Training Materials**: Additional tutorials and examples available in `/docs` directory
- **Community**: Join our healthcare developer community for best practices and collaboration

---

*The HXIS Integration Sandbox is a development tool designed to accelerate NGEMR integration projects. It provides realistic healthcare data and Epic-compatible APIs for safe development and testing environments.*