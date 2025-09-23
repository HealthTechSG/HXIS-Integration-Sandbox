import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useSelector } from 'react-redux';

import { SIDE_MENU_ITEMS } from '@/configs';
import { useTabs } from '@/common/hooks/useTabs';
import type { RootState } from '@/redux/store';

const { Sider } = Layout;

interface SideMenuSiderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SideMenuSider: React.FC<SideMenuSiderProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const { activeTabId } = useSelector((state: RootState) => state.tabs);
  const { openPatientListTab, openPractitionerListTab, openLocationListTab, openListListTab } = useTabs();

  const handleMenuClick = (info: any) => {
    switch (info.key) {
      case 'patient-list':
        openPatientListTab();
        break;
      case 'practitioner-list':
        openPractitionerListTab();
        break;
      case 'location-list':
        openLocationListTab();
        break;
      case 'list-list':
        openListListTab();
        break;
      default:
        break;
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      breakpoint="lg"
      collapsedWidth={0}
      onBreakpoint={(broken) => {
        // optional: if you want to auto-open when returning to desktop
        if (!broken) setCollapsed(false);
      }}
      onCollapse={(newCollapsed) => {
        setCollapsed(newCollapsed);
      }}
      className="custom-private-sider px-2"
      style={{ backgroundColor: '#93d4ff' }}
    >
      <div 
        className="w-full h-14 flex justify-center items-center mb-4"
        style={{ backgroundColor: '#93d4ff' }}
      >
        <Typography.Title level={3} className="m-0 text-[#ba122b] font-bold italic">HXEMR</Typography.Title>
      </div>

      <Menu
        items={SIDE_MENU_ITEMS}
        mode="inline"
        selectedKeys={activeTabId ? [
          activeTabId.startsWith('patient-') ? 'patient-list' :
          activeTabId.startsWith('practitioner-') ? 'practitioner-list' :
          activeTabId.startsWith('location-') ? 'location-list' :
          activeTabId.startsWith('list-') ? 'list-list' :
          ''
        ] : []}
        onClick={handleMenuClick}
        className="custom-private-menu"
      />
      
      <style>{`
        .custom-private-sider .ant-layout-sider-trigger {
          background-color: #0b78b2 !important;
          color: #334452 !important;
        }
        
        .custom-private-menu {
          background-color: transparent !important;
          border-right: none !important;
          margin: 0px !important;
          padding: 0 !important;
          outline: none !important;
        }
        
        .custom-private-menu ul {
          margin: 4px 0px !important;
          padding: 0 !important;
        }
        
        .custom-private-menu .ant-menu-item {
          background-color: transparent !important;
          color: #334452 !important;
          margin: 0 !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          font-weight: 500 !important;
          line-height: 1.5 !important;
        }
        
        .custom-private-menu .ant-menu-item:hover {
          background-color: #91d5fc !important;
          color: #334452 !important;
        }
        
        .custom-private-menu .ant-menu-item-selected {
          background-color: #0d99e4 !important;
          color: white !important;
        }
        
        .custom-private-menu .ant-menu-item-selected:hover {
          background-color: #0b78b2 !important;
          color: white !important;
        }
        
        .custom-private-menu .ant-menu-item a {
          color: inherit !important;
          display: block !important;
          width: 100% !important;
          text-align: left !important;
        }
        
        .custom-private-menu .ant-menu-item-selected a {
          color: white !important;
          font-weight: 600 !important;
        }
      `}</style>
    </Sider>
  );
};

export default SideMenuSider;
