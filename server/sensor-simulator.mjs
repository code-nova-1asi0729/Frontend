// sensor simulator for the mvp: replaces the iot sensor network.
// every few seconds it sends a random reading for each active sensor to the fake api.
// usage: node server/sensor-simulator.mjs   (api_url and interval_ms are optional)

const API_URL = process.env.API_URL ?? 'http://localhost:3000/api/v1';
const INTERVAL_MS = Number(process.env.INTERVAL_MS ?? 10000);

// normal range of each metric; values are generated inside it
const metrics = {
  VIBRATION: { unit: 'mm/s', min: 1.5, max: 4.0 },
  TEMPERATURE: { unit: '°C', min: 30, max: 45 },
  HUMIDITY: { unit: '%', min: 40, max: 60 },
  POWER_CONSUMPTION: { unit: 'kW', min: 8, max: 15 },
};

const metricsByEquipmentType = {
  WATER_PUMP: ['VIBRATION', 'POWER_CONSUMPTION'],
  ELECTRICAL_PANEL: ['TEMPERATURE'],
  ELEVATOR: ['VIBRATION'],
  HVAC: ['TEMPERATURE', 'HUMIDITY'],
};

const randomValue = ({ min, max }) => Math.round((min + Math.random() * (max - min)) * 10) / 10;

async function sendReadings() {
  const sensors = await (await fetch(`${API_URL}/sensors?status=MONITORING_ACTIVE`)).json();
  const equipment = await (await fetch(`${API_URL}/equipment`)).json();
  const now = new Date().toISOString();

  for (const sensor of sensors) {
    const item = equipment.find((e) => e.id === sensor.equipmentId);
    if (!item) continue;
    for (const metric of metricsByEquipmentType[item.type] ?? []) {
      const reading = {
        sensorId: sensor.id,
        equipmentId: item.id,
        metric,
        value: randomValue(metrics[metric]),
        unit: metrics[metric].unit,
        status: 'VALID',
        recordedAt: now,
      };
      await fetch(`${API_URL}/sensor-readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reading),
      });
      console.log(`${now} ${sensor.serialNumber} ${metric} ${reading.value} ${reading.unit}`);
    }
    await fetch(`${API_URL}/sensors/${sensor.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastSeenAt: now }),
    });
  }
}

console.log(`Sending readings to ${API_URL} every ${INTERVAL_MS / 1000} s. Press Ctrl+C to stop.`);
sendReadings();
setInterval(sendReadings, INTERVAL_MS);
