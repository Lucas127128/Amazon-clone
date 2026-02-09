import ky from "ky";

export const kyInternal = ky.extend({
  prefixUrl: "http://localhost:3000",
});

export const kyExternal = ky.extend({
  prefixUrl: "https://localhost:3001",
});
