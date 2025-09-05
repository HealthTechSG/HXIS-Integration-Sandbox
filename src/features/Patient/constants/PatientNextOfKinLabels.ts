const PatientNextOfKinLabels = {
  //* General Fields -----------------------------------------------------------
  fields: {
    name: 'Name',
    relationship: 'Relationship',
    contactNumber: 'Contact Number',
    remarks: 'Remarks',
  },

  //* Dropdown Options ---------------------------------------------------------
  options: {
    relationship: {
      parent: 'Parent',
      spouse: 'Spouse',
      child: 'Child',
      sibling: 'Sibling',
      relative: 'Relative',
      others: 'Others',
    },
  },
};

export default PatientNextOfKinLabels;
