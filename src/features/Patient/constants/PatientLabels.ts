const PatientLabels = {
  //* General Fields -----------------------------------------------------------
  fields: {
    mrn: 'MRN',
    name: 'Name',
    birthdate: 'Date of Birth',
    gender: 'Gender',
    maritalStatus: 'Marital Status',
    idType: 'ID Type',
    idNumber: 'NRIC / FIN / Passport Number',
    contactNumber: 'Contact Number',
    email: 'Email',
    active: 'Active',
  },

  //* Dropdown Options ---------------------------------------------------------
  options: {
    gender: {
      male: 'Male',
      female: 'Female',
      unknown: 'Unknown',
    },
    maritalStatus: {
      single: 'Single',
      married: 'Married',
      divorced: 'Divorced',
      widowed: 'Widowed',
    },
    idType: {
      citizen: 'Singapore Citizen (NRIC)',
      pr: 'Singapore Permanent Resident (NRIC)',
      passholder: 'Long-Term Pass Holder (FIN)',
      foreigner: 'Foreigner (Passport)',
    },
  },
};

export default PatientLabels;
