import { Card } from 'antd';
import type { CardProps } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

type AntdCardTabListProp = CardProps['tabList'];

//* Props ----------------------------------------------------------------------
interface TabProps {
  key: string;
  title: string;
  content: React.ReactNode;
  href?: string;
}

interface BaseTabbedCardProps {
  tabList: TabProps[];
  initialActiveTab?: string;
}

//* FC -------------------------------------------------------------------------
const BaseTabbedCard: React.FC<BaseTabbedCardProps> = ({
  initialActiveTab,
  tabList,
}) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    initialActiveTab || tabList[0].key,
  );

  const antdTablist: AntdCardTabListProp = tabList.map((tab) => {
    const { href, key, title } = tab;

    return {
      key,
      tab: title,
      href,
    };
  });

  const tabChangeHandler = (key: string) => {
    const href = tabList.find((tab) => tab.key === key)?.href;

    if (href) {
      navigate(href, { replace: true });
    }

    setActiveTab(key);
  };

  //* JSX ----------------------------------------------------------------------
  return (
    <Card
      activeTabKey={activeTab}
      onTabChange={tabChangeHandler}
      tabList={antdTablist}
      tabProps={{ size: 'middle' }}
    >
      {tabList.find((tab) => tab.key === activeTab)?.content}
    </Card>
  );
};

//* Export ---------------------------------------------------------------------
export default BaseTabbedCard;
