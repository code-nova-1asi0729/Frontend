# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-14

Version of the web application delivered for AV2.

### Added

- Alerts: each alert shows its limit value, and among alerts of the same severity the most out-of-range one comes first.
- Alerts: confirmation before resolving an alert, and filters by building and device type.
- Devices: number of active alerts of each device.
- Incidents: building of each incident, building filter and confirmation before resolving.
- Buildings: confirmation before deleting a building.
- Readings: current and pressure metrics.
- Terms and conditions and privacy policy views, linked from a footer, and a privacy notice on the first visit.

### Changed

- **Breaking:** critical equipment is now called device in the whole app: `/asset-monitoring/devices` view, `/api/v1/devices` endpoint and `deviceId` field.
- Alerts: the acknowledge button is now called "Attend".
- Sensors: assigning and releasing a sensor use the `assignments` and `releases` endpoints of the RESTful API.
- The README links the renamed Web-services repository.

### Fixed

- Devices: the device list shows the status column again.
- The terms and privacy views open instead of the page not found view.

## [0.3.0] - 2026-11-09

### Added

- Home: a quick access card for administrators, residents and maintenance companies.
- Contributing guide and MIT license.

### Changed

- Incidents: starting, resolving and rating an incident now use the `management-starts`, `resolutions` and `ratings` endpoints of the RESTful API.
- Buttons and cards use the same rounded corners in the whole app.
- The README explains how to run the app with the RESTful API.

### Removed

- Visual Studio Code settings from the repository.

## [0.2.0] - 2026-11-07

### Added

- Shared: base entity, assembler and API endpoint classes, layout with side navigation, language switcher (English and Spanish), home and page not found views.
- Asset Monitoring: buildings and critical equipment lists and forms.
- Asset Monitoring: sensors with assignment form and reading history.
- Asset Monitoring: active alerts dashboard with acknowledgement and resolution.
- Incidents: incident list, report and rating views.
- Error messages show the problem detail returned by the RESTful API.

### Changed

- Production environment points to the RESTful API deployed on Render instead of the fake API.
- Development environment points to the local RESTful API.
- Alerts are acknowledged and resolved through the `acknowledgements` and `resolutions` endpoints.
