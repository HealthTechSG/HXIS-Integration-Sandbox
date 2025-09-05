This guide provides high-level instructions on adding new CRUD pages and functions
for a new resource data.

[[_TOC_]]

---

# Define Route Paths

Edit `RouteMap.ts` to define the paths.

For example, if we want to make a new set of CRUD called "Doctors", we can add a new set of Routes like below:

```TypeScript
  DoctorPaths: {
    DoctorList: '/doctor',
    DoctorCreate: '/doctor/new',
    DoctorView: '/doctor/view/:id',
    DoctorEdit: '/doctor/edit/:id',
  }
```

---

# Page Scaffolding

It is always recommended to start a new feature with scaffolding all the placeholder pages.

This way we can have a base for folder structure and skeleton files to work on.

Start by creating a new sub-folder under the `/src/features` folder, and populate them with blank files.

```
/src/features
|
+-- /Doctor
    |
    +-- /components
    |   +-- DoctorListPage.tsx
    |   +-- DoctorCreatePage.tsx
    |   +-- DoctorViewPage.tsx
    |   +-- DoctorEditPage.tsx
    |   +-- index.ts
    |
    +-- /routes
    |   +-- DoctorRoutes.ts
    |
    +-- index.ts
```

We will be using the template included CustomInventory CRUD as a sample for simple CRUD page flow.

For each pages, use below template to create a blank component file.

```TypeScript
import { Card } from 'antd';
import React from 'react';

import { BasePage } from '@/common/components';

const DoctorListPage: React.FC = () => {
    return (
        <BasePage title="Doctor List">
            <Card>
                Doctor List
            </Card>
        </BasePage>
    );
};

export default DoctorListPage;
```

Next, refer to the `CustomInventoryRoutes.tsx`, and define the routes, to map the paths to the page component.

Example:

```TypeScript
const DoctorRoutes: RouteObject[] = [
  {
    path: DoctorPaths.DoctorList,
    element: <DoctorListPage />,
  },
  {
    ... other route definitions ...
  }
]
```

Next, include this route file into the `/features/routes.ts`.

Now, if you open the corresponding paths in your browser, you should be able to see the blank placeholder page.

---

## CRUD Page Flow

Below is a sample CRUD page flow, as a guideline reference when designing for UI/UX.

Download this file - [React-App-Sample-Pageflow.excalidraw.json](./.attachments/React-App-Sample-Pageflow.excalidraw.json)

Go to https://excalidraw.com/, and load the file.

---

# Page Components

The template included 2 different layouts for use: `BasePage` and `BaseTabbedCard`.

**BasePage** - This will wrap the page content with a page title and breadcrumb. Refer to `HomePage.tsx`, `CustomInventoryListPage.tsx`, and `CustomInventoryAddPage.tsx` for example usage.

**BaseTabbedCard** - Refer to `PatientDetailTabbedPage.tsx` for example usage.

---

## Listing / Table Page

The template included 2 different types of premade tables: `BaseTable` and `BaseStaticTable`.

**BaseTable** - This is a premade table that includes simplified props that handles paging, sorting, loading states. Refer to `CustomInventoryTable.tsx` for example usage.

`TableCurrentFilterTags`, `TableFilterFormModal`, and `TableSearchForm` is also available to be used together with a `BaseTable`.

Sample Code:

```TypeScript
<BaseTable
    columns={columns}
    dataSource={response?.data}
    error={isError}
    loading={isFetching}
    onChange={(page, pageSize, sortFields, sortDirections) => {
        setPagination(page, pageSize);
        setTableSorting(sortFields, sortDirections);
    }}
    totalRowCount={response?.total}
/>
```

**BaseStaticTable** - This is a premade table meant for displaying full static data. Paging is ommitted by design, and sorting should be done using client-side sorting. See `PatientAllergyTable.tsx` or `PatientNextOfKinTable.tsx` for example usage.

Sample Code:

```TypeScript
<BaseStaticTable
    columns={columns}
    dataSource={data}
    loading={isFetching}
/>
```

---

## Form Page

All the form pages included in the template project are made using Ant Design's Form.

Please refer to `CustomInventoryAddPage.tsx`, `CustomInventoryEditPage.tsx` or any other form pages as example usage.

---

## Modals

Most of the Modals used in the template project are made using Ant Design's Modal.

Please refer to `CustomInventoryDeleteModal.tsx` for example usage.

The template project provided a static `useModal()` hook for displaying simple modals (eg: simple info prompt, simple confirmation prompt). It is a pre-configured Ant Design static modal. See `UserPopoverContent.tsx` for example usage.

Sample Code:

```TypeScript
import { useModal } from '@/common/hooks';
```

```TypeScript
const modal = useModal();

const onLogoutClick = () => {
  modal.confirm({
    title: 'Logout',
    content: 'Are you sure you want to logout?',
    onOk: () => {
      doLogout();
    },
  });
};
```

---

## Notification

Template project included a static `useNotification()` hook, for displaying pre-configured snackbar notification use.

Sample Code:

```TypeScript
import { useNotification } from '@/common/hooks';
```

```TypeScript
const { showError, showSuccess } = useNotification();

const onFormFinish = async (values: any) => {
    submitForm(values)
        .then(() => {
            showSuccess('Form submit success!');
        })
        catch((error) => {
            showError(error);
        })
};
```

---

# Backend API Calls

We will be using the `queryFn` feature of RTK Query to handle all the API calls. The underlying FHIR API call will be implemented using SMART on FHIR JavaScript library (ie. the `fhirclient`).

---

## Define the Types

Most of the time, the UI components (ie. forms and tables) will not be directly using the FHIR resource modals directly due to differences in the data structure of the resource. For this step,
we will be defining the types that the UI components will use.

> You may skip this step if your UI components are able to directly consume the FHIR resource structure.

Refer to `FhirPatientTypes.ts` for using default FHIR resource.

Refer to `CustomInventoryTypes.ts` and `FhirCustomInventoryTypes` for defining custom FHIR resources.

---

## Define the Mapping Functions

After defining the types that will be used by the UI components, we create a MappingUtils to define the mapping functions between the UI modals and the FHIR modals.

Refer to `FhirPatientMapperUtil.ts` and `CustomInventoryMapperUtil.ts`.

---

## Create the RTK Query Hooks

Refer to `FhirPatientService.ts` and `CustomInventoryService.ts` to create the RTK Query hooks, including the `useQuery` and `useMutation` hooks.

The project template has pre-coded the `RtkFhirClient` which simplifies the integration of RTK Query and fhirclient. We will be using the `queryFn` feature of RTK Query to create the API hooks.

Lastly, append the reducer and middleware into the redux store. The redux store is in `/redux/store/index.ts`.

---

## Integrate the RTK Query Hooks into the UI Components

Refer to the respective UI components on the sample usage of RTK Query hooks.

| Hook Type          | UI Page Reference                                               |
| ------------------ | --------------------------------------------------------------- |
| Fetch List (Query) | `PatientTable.ts` or `CustomInventoryTable.ts`                  |
| Fetch One (Query)  | `PatientProfileTabContent.ts` or `CustomInventoryViewDetail.ts` |
| Create (Mutation)  | `PatientAddPage.ts` or `CustomInventoryAddPage.ts`              |
| Edit (Mutation)    | `PatientEditPage.ts` or `CustomInventoryEditPage.ts`            |
| Delete (Mutation)  | `PatientDeleteModal.ts` or `CustomInventoryDeleteModal.ts`      |
