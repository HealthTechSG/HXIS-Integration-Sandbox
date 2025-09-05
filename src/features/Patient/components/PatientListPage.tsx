import { Card } from 'antd';
import React from 'react';
import PatientTable from './PatientTable';

const PatientListPage: React.FC = () => {
  return (
    <div className="p-4">
      <PatientTable />
    </div>
  );
};

export default PatientListPage;
