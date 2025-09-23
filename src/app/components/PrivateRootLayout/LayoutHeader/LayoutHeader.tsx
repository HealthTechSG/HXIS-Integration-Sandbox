import React from 'react';
import { Layout, Button, Dropdown, Avatar, message } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

interface LayoutHeaderProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  isMobile: boolean;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  collapsed,
  setCollapsed,
  isMobile,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('selectedOrganization');
    message.success('Logged out successfully');
    navigate('/login');
  };

  const userEmail = 'demo@healthx.sg';
  const selectedOrganization = localStorage.getItem('selectedOrganization') || 'HXEMR Demo App';

  const dropdownItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];
  return (
    <Header className="h-14 px-4 bg-[#93d4ff]">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
          )}
        </div>
        
        <div className="flex items-center">
          <Dropdown
            menu={{ items: dropdownItems }}
            placement="bottomRight"
            trigger={['hover', 'click']}
          >
            <div className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#0b78b2' }}
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{userEmail}</span>
                <span className="text-xs">{selectedOrganization}</span>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default LayoutHeader;
