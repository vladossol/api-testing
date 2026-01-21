#API Automation Tests — Job Management API

This project contains automated API tests for a Job Management API using Playwright (JavaScript).
The API is tested against the provided Python Flask mock server, which intentionally contains known bugs.
Tests are written according to the API specification and expected behavior.

#Prerequisites
*Node.js (v18+ recommended)
*Python 3.x
*npm

#How to run the mock server
The mock server is started automatically by Playwright before running tests.

If you want to run it manually:
```python mock_server/mock_server.py```
The server will be available at:
```http://localhost:5000```

#How to run the tests
Install dependencies:
```npm install```

Run all API tests:
```npx playwright test```

View HTML test report:
```npx playwright show-report```

#Test coverage summary
#Create Job (POST /jobs)
*Create job with valid data
*Missing required fields
*Invalid priority
*Validation errors (expected failures based on spec)

#Get Job (GET /jobs/{id})
*Get existing job
*Non-existent job returns 404
#List Jobs (GET /jobs)

*Returns list of jobs
*Filter by status (pending, running, completed, failed)
*Filter by priority (low, medium, high)
*Invalid filter values return 400 (expected failure)
*Limit parameter behavior (expected failure)

Note:
The mock server uses shared in-memory storage.
List tests validate filtering logic and response structure rather than strict dataset isolation.

#Update Job (PATCH /jobs/{id})
*Valid status transition (pending → running)
*Invalid status transition (expected failure)
*Non-existent job returns 404

#Delete Job (DELETE /jobs/{id})
*Delete pending job
*Delete running job (expected failure)
*Non-existent job returns 404

#Project structure notes

The project also includes the following additional materials:

Bug Report - documented bugs report is stored in a dedicated folder 'deliverables' within the project.
Test Reports - Playwright test output (HTML report) is stored in a dedicated folder 'deliverables' within the project.

#Notes
API tests are implemented using Playwright’s API testing features.
Some test failures are expected due to intentionally introduced bugs in the mock server.

Tests can be executed in parallel mode.
