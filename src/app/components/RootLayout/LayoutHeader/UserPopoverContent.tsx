import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Flex, Divider, Button, Avatar } from 'antd';
import React from 'react';
import { useAuth } from 'react-oidc-context';

import { useModal, useNotification } from '@/common/hooks';

//* FC -------------------------------------------------------------------------
const UserPopoverContent: React.FC = () => {
  const modal = useModal();
  const { showSuccess } = useNotification();
  const { signoutRedirect, user } = useAuth();

  const onLogoutClick = () => {
    modal.confirm({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      onOk: async () => {
        showSuccess('Logout Success');
        signoutRedirect({
          post_logout_redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
          extraQueryParams: {
            client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
            redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
            response_type: 'code',
          },
        });
      },
    });
  };

  //* JSX ----------------------------------------------------------------------
  return (
    <Flex align="center" className="min-w-32 p-2" gap="small" vertical>
      <Avatar icon={<UserOutlined />} size="large" />
      <h3 className="uppercase">
        {user?.profile.email ?? 'User information not available'}
      </h3>
      <Divider className="m-1" />
      <Button
        block
        icon={<LogoutOutlined />}
        onClick={onLogoutClick}
        type="primary"
      >
        Logout
      </Button>
    </Flex>
  );
};

//* Export ---------------------------------------------------------------------
export default UserPopoverContent;
