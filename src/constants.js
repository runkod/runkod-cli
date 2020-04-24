module.exports = {
  PROJECT_STATUS_ON: 1,
  PROJECT_STATUS_MAINTENANCE: 2,
  PROJECT_STATUS_OFF: 3,
  PROJECT_STATUSES: [
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
  ],
  GLOB_RULES: [
    '**/node_modules/**',
    'Thumbs.db',
  ]
};
