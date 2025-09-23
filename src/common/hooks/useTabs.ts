import { useDispatch } from 'react-redux';
import { addTab, removeTab, setActiveTab, updateTabProps } from '@/redux/slice/tabs';
import type { TabItem } from '@/redux/slice/tabs';

export const useTabs = () => {
  const dispatch = useDispatch();

  const openPatientListTab = () => {
    const tab: TabItem = {
      id: 'patient-list',
      label: 'Patient List',
      closable: true,
      componentType: 'PatientListPage',
    };
    dispatch(addTab(tab));
  };

  const openPatientProfileTab = (patientId: string, patientName?: string) => {
    const tab: TabItem = {
      id: `patient-profile-${patientId}`,
      label: `${patientName || 'Patient Profile'}`,
      closable: true,
      componentType: 'PatientProfilePage',
      props: { patientId },
    };
    dispatch(addTab(tab));
  };

  const openPractitionerListTab = () => {
    const tab: TabItem = {
      id: 'practitioner-list',
      label: 'Practitioner List',
      closable: true,
      componentType: 'PractitionerListPage',
    };
    dispatch(addTab(tab));
  };

  const openPractitionerProfileTab = (practitionerId: string, practitionerName?: string) => {
    const tab: TabItem = {
      id: `practitioner-profile-${practitionerId}`,
      label: `${practitionerName || 'Practitioner Profile'}`,
      closable: true,
      componentType: 'PractitionerProfilePage',
      props: { practitionerId },
    };
    dispatch(addTab(tab));
  };

  const openLocationListTab = () => {
    const tab: TabItem = {
      id: 'location-list',
      label: 'Location List',
      closable: true,
      componentType: 'LocationListPage',
    };
    dispatch(addTab(tab));
  };

  const openListListTab = () => {
    const tab: TabItem = {
      id: 'list-list',
      label: 'List Management',
      closable: true,
      componentType: 'ListListPage',
    };
    dispatch(addTab(tab));
  };

  const closeTab = (tabId: string) => {
    dispatch(removeTab(tabId));
  };

  const switchTab = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  const updateTab = (tabId: string, props: any) => {
    dispatch(updateTabProps({ tabId, props }));
  };

  return {
    openPatientListTab,
    openPatientProfileTab,
    openPractitionerListTab,
    openPractitionerProfileTab,
    openLocationListTab,
    openListListTab,
    closeTab,
    switchTab,
    updateTab,
  };
};

export default useTabs;