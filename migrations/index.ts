import * as migration_20260401_122532 from './20260401_122532';
import * as migration_20260401_131503 from './20260401_131503';
import * as migration_20260408_141457 from './20260408_141457';

export const migrations = [
  {
    up: migration_20260401_122532.up,
    down: migration_20260401_122532.down,
    name: '20260401_122532',
  },
  {
    up: migration_20260401_131503.up,
    down: migration_20260401_131503.down,
    name: '20260401_131503',
  },
  {
    up: migration_20260408_141457.up,
    down: migration_20260408_141457.down,
    name: '20260408_141457'
  },
];
