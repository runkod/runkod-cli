export const PROJECT_STATUS_ON = 1;
export const PROJECT_STATUS_MAINTENANCE = 2;
export const PROJECT_STATUS_OFF = 3;

export const PROJECT_STATUSES = [
  {
    value: 1,
    title: 'On',
  },
  {
    value: 2,
    title: 'In Maintenance'
  },
  {
    value: 3,
    title: 'Off'
  }
];

export const GLOB_RULES = [
  '**/node_modules/**',
  'Thumbs.db',
];
