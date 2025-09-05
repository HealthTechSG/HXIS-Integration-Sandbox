const PatientImmunizationLabels = {
  //* General Fields -----------------------------------------------------------
  fields: {
    name: 'Name',
    productName: 'Product',
    manufacturerName: 'Manufacturer',
    lotNumber: 'Lot Number',
    vaccineDate: 'Vaccine Date',
    informationSource: 'Information Source',
    note: "Doctor's Note",
    reaction: 'Reaction',
    reactionDate: 'Reaction Date',
  },

  //* Dropdown Options ---------------------------------------------------------
  options: {
    informationSource: {
      provider: 'Healthcare Provider',
      record: 'Written Record',
      recall: 'Parent/Guardian/Patient Recall',
      school: 'School Record',
    },
  },
};

export default PatientImmunizationLabels;
