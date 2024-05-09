import { migration } from './database';

(async () => {
  await migration();
})();
