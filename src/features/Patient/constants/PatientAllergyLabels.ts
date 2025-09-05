const PatientAllergyLabels = {
  //* General Fields -----------------------------------------------------------
  fields: {
    name: 'Name',
    description: 'Description',
    type: 'Type',
    category: 'Category',
    severity: 'Severity',
    recordedDate: 'Recorded Date',
    note: "Doctor's Note",
  },

  //* Dropdown Options ---------------------------------------------------------
  options: {
    type: {
      allergy: 'Allergy',
      intolerance: 'Intolerance',
    },
    category: {
      food: 'Food',
      medication: 'Medication',
      environment: 'Environment',
      biologic: 'Biologic',
    },
    severity: {
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
    },
  },
};

export default PatientAllergyLabels;
