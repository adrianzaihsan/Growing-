import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: () => Promise.resolve({ success: false }),
  register: () => Promise.resolve({ success: false }),
  logout: () => {},
});
