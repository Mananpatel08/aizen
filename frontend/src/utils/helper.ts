import type { Theme } from "../types";

export const getSaved = (): Theme => {
  const v = localStorage.getItem("aizen-theme");
  return v === "light" || v === "dark" ? v : "dark";
};

let _id = 0;
export const genId = () => `msg-${++_id}-${Date.now()}`;
