import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TabItem {
  id: string;
  label: string;
  closable: boolean;
  componentType: string; // Component identifier instead of direct reference
  props?: any;
}

interface TabsState {
  activeTabId: string | null;
  tabs: TabItem[];
}

const initialState: TabsState = {
  activeTabId: null,
  tabs: [],
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<TabItem>) => {
      const existingTab = state.tabs.find(tab => tab.id === action.payload.id);
      if (!existingTab) {
        state.tabs.push(action.payload);
      }
      state.activeTabId = action.payload.id;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const tabIndex = state.tabs.findIndex(tab => tab.id === action.payload);
      if (tabIndex !== -1) {
        state.tabs.splice(tabIndex, 1);
        
        // If removing the active tab, switch to the previous tab or the first available tab
        if (state.activeTabId === action.payload) {
          if (state.tabs.length > 0) {
            const newActiveIndex = Math.max(0, tabIndex - 1);
            state.activeTabId = state.tabs[newActiveIndex]?.id || null;
          } else {
            state.activeTabId = null;
          }
        }
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      const tabExists = state.tabs.some(tab => tab.id === action.payload);
      if (tabExists) {
        state.activeTabId = action.payload;
      }
    },
    updateTabProps: (state, action: PayloadAction<{ tabId: string; props: any }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.tabId);
      if (tab) {
        tab.props = { ...tab.props, ...action.payload.props };
      }
    },
    clearAllTabs: (state) => {
      state.tabs = [];
      state.activeTabId = null;
    },
  },
});

export const { addTab, removeTab, setActiveTab, updateTabProps, clearAllTabs } = tabsSlice.actions;
export default tabsSlice.reducer;