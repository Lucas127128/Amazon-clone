import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 6100,
  duration: '30s',
};

export default function () {
  const res = http.get('https://localhost:8080/index.html');
  check(res, { 'status is 200': (res) => res.status === 200 });
  sleep(1);
}
