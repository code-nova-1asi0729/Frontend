# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
