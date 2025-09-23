import { useState } from 'react';

import { useCreatePatientMutation } from '@/services/Patient/PatientService';
import type { CreatePatientRequest } from '@/services/Patient/PatientTypes';

//* Hook -----------------------------------------------------------------------
const usePatientAddForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [createPatientBundle] = useCreatePatientMutation();

  //* Handle Submit ------------------------------------------------------------
  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    // Pre-process data
    const request: CreatePatientRequest = {
      ...values,
      active: !values?.isInactive,
    };

    // Trigger mutation
    const { data, error } = await createPatientBundle(request);

    setIsLoading(false);

    if (error) {
      return Promise.reject(error);
    }

    return data!.id;
  };

  //* Return -------------------------------------------------------------------
  return {
    handleSubmit,
    isLoading,
  };
};

//* Export ---------------------------------------------------------------------
export default usePatientAddForm;
