import * as migration_20261122_204914_inicial from './20261122_204914_inicial';
import * as migration_20261123_124031_eventos_noticias from './20261123_124031_eventos_noticias';

export const migrations = [
  {
    up: migration_20261122_204914_inicial.up,
    down: migration_20261122_204914_inicial.down,
    name: '20261122_204914_inicial',
  },
  {
    up: migration_20261123_124031_eventos_noticias.up,
    down: migration_20261123_124031_eventos_noticias.down,
    name: '20261123_124031_eventos_noticias'
  },
];
