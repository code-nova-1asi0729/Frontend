export const environment = {
  production: false,
  // Fake API (json-server) running locally: npm run fake-api
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1',
  platformProviderBuildingsEndpointPath: '/buildings',
  platformProviderEquipmentEndpointPath: '/equipment',
  platformProviderSensorsEndpointPath: '/sensors',
  platformProviderSensorReadingsEndpointPath: '/sensor-readings',
  platformProviderAlertsEndpointPath: '/alerts',
  platformProviderIncidentsEndpointPath: '/incidents',
};
