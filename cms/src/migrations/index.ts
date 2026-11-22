import * as migration_20261122_204914_inicial from './20261122_204914_inicial';

export const migrations = [
  {
    up: migration_20261122_204914_inicial.up,
    down: migration_20261122_204914_inicial.down,
    name: '20261122_204914_inicial'
  },
];
