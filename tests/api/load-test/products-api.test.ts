import http from "k6/http";
import { sleep, check } from "k6";
const products = JSON.parse(open("../../../backend/products.json"));

export const options = {
  vus: 4200,
  duration: "10s",
};

export default function () {
  let res = http.get("https://localhost:3001/products");
  check(res, { "Response is the right JSON": (res) => res?.body === products });
  sleep(1);
}
