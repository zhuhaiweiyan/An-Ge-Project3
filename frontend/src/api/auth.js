// frontend/src/api/auth.js

import api from "./axios";

const BASE_URL = "/api/auth";

export const register = async ({ username, password, passwordConfirm }) => {
  const res = await api.post(`${BASE_URL}/register`, {
    username,
    password,
    passwordConfirm,
  });
  return res.data;
};

export const login = async ({ username, password }) => {
  const res = await api.post(`${BASE_URL}/login`, {
    username,
    password,
  });
  console.log("LOGIN RAW RESPONSE:", res.data);
  return res.data;
};

export const logout = async () => {
  const res = await api.post(`${BASE_URL}/logout`);
  return res.data;
};

export const getHighScores = async () => {
  const res = await api.get(`${BASE_URL}/highscores`);
  return res.data;
};
