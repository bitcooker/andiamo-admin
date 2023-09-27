import { create } from "zustand";

interface IAdminStore {
  admin: AdminType | null;
  setAdmin: (value: AdminType | null, isReset: boolean) => void;
}

const useAdmin = create<IAdminStore>((set, get) => {
  let initialState: AdminType | null = null;

  if (typeof window !== "undefined") {
    const savedValue = localStorage.getItem("admin");
    if (savedValue != null) {
      const savedAdmin = JSON.parse(savedValue) as AdminType;

      initialState = {
        id: savedAdmin.id,
        email: savedAdmin.email,
      };
    }
  }

  return {
    admin: initialState,
    setAdmin: (value, isReset) => {
      if (isReset) {
        localStorage.removeItem("admin");
        set({ admin: null });
      } else {
        localStorage.setItem("admin", JSON.stringify(value));
        set({ admin: value });
      }
    },
  };
});

export default useAdmin;
