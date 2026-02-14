import http from 'k6/http';
import { check } from 'k6';
const productsJSON = open('../../src/api/rawProducts.json');

export const options = {
  vus: 4200,
  duration: '10s',
};

export default function () {
  const res = http.get('https://localhost:3001/products');
  check(res, {
    'Response is the right JSON': (res) => res?.body === productsJSON,
  });
}
