import { create } from "zustand";

interface IAppStore {
  showSidebar: boolean;
  setShowSidebar: (_showSidebar: boolean) => void;
}

const useAppStore = create<IAppStore>((set) => ({
  showSidebar: true,
  setShowSidebar: (_showSidebar: boolean) => {
    set({ showSidebar: _showSidebar });
  },
}));

export default useAppStore;
