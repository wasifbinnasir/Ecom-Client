import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  roles: string[];
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null, // 👈 load from storage
  roles: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; roles: string[] }>
    ) => {
      state.token = action.payload.token;
      state.roles = action.payload.roles;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("roles", JSON.stringify(action.payload.roles));
      }

      console.log("🔑 User logged in:", state.token);
    },
    logout: (state) => {
      state.token = null;
      state.roles = [];


      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
