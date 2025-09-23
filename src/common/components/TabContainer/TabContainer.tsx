import React from 'react';
import { Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { removeTab, setActiveTab } from '@/redux/slice/tabs';
import { PatientListPage, PatientProfilePage } from '@/features/Patient/components';
import { PractitionerListPage, PractitionerProfilePage } from '@/features/Practitioner/components';
import { LocationListPage } from '@/features/Location/components';
import { ListListPage } from '@/features/List/components';

const TabContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { tabs, activeTabId } = useSelector((state: RootState) => state.tabs);

  const handleTabChange = (key: string) => {
    dispatch(setActiveTab(key));
  };

  const handleTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove' && typeof targetKey === 'string') {
      dispatch(removeTab(targetKey));
    }
  };

  // Component resolver
  const getComponent = (componentType: string) => {
    switch (componentType) {
      case 'PatientListPage':
        return PatientListPage;
      case 'PatientProfilePage':
        return PatientProfilePage;
      case 'PractitionerListPage':
        return PractitionerListPage;
      case 'PractitionerProfilePage':
        return PractitionerProfilePage;
      case 'LocationListPage':
        return LocationListPage;
      case 'ListListPage':
        return ListListPage;
      default:
        return () => <div>Component not found</div>;
    }
  };

  // Convert Redux tabs to Ant Design tab items
  const tabItems = tabs.map(tab => {
    const TabComponent = getComponent(tab.componentType);
    return {
      key: tab.id,
      label: tab.label,
      closable: tab.closable,
      children: <TabComponent {...(tab.props || {})} />,
    };
  });

  if (tabs.length === 0) {
    return (
      <div className="bg-gray-100 rounded-tl-lg min-h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg">Welcome to the Patient Management System</p>
          <p className="text-sm">Select an item from the sidebar to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-tl-lg min-h-full">
      <Tabs
        type="editable-card"
        activeKey={activeTabId || undefined}
        onChange={handleTabChange}
        onEdit={handleTabEdit}
        items={tabItems}
        hideAdd
        className="h-full"
        tabBarStyle={{
          margin: 0,
          paddingLeft: '16px',
          paddingRight: '16px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #d9d9d9',
        }}
      />
      <style>{`
        .ant-tabs-content-holder {
          padding: 0;
          height: calc(100vh - 120px);
          overflow: auto;
        }
      `}</style>
    </div>
  );
};

export default TabContainer;