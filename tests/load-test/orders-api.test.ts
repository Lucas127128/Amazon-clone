import http from "k6/http";
import { sleep, check } from "k6";
import cart from "../../src/api/cart.json";
const order = JSON.parse(open("../../backend/api/order.json"));

export const options = {
  vus: 4400,
  duration: "30s",
};

export default function () {
  const url = "https://localhost:3001/orders";
  const payload = JSON.stringify(cart);
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = http.post(url, payload, params);
  if (cart && order) {
    check(res, {
      "status is 200": (res) => res.body === JSON.stringify(order),
    });
  }
  sleep(1);
}
