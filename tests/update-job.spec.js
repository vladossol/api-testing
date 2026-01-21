const { test, expect } = require('@playwright/test');
const { createJob } = require('../helpers/helpers.js');

test('UPDATE — valid transition pending → running', async ({ request }) => {
    // Creating test job
    const newJob = await createJob(request, 'Test job', 'high');
    expect(newJob.status()).toBe(201);

    const job = await newJob.json();
    // Update status to running
    const newResponse = await request.patch(`/jobs/${job.id}`, {
        data: {
            status: 'running',
        },
    });

    // Assertions
    expect(newResponse.status()).toBe(200);
    const updatedJob = await newResponse.json();
    expect(updatedJob.status).toBe('running');
});

test('UPDATE — invalid transition pending → completed should return 400', async ({ request }) => {
    // Creating test job
    const newJob = await createJob(request, 'Test job', 'high');
    const job = await newJob.json();

    // Update status to completed
    const updateResponse = await request.patch(`/jobs/${job.id}`, {
        data: {
            status: 'completed',
        },
    });

    // Assertions
    expect(updateResponse.status()).toBe(400);
});

test('UPDATE — non-existent job returns 404', async ({ request }) => {
    const fakeJobId = 'job-does-not-exist';
    const response = await request.patch(`/jobs/${fakeJobId}`, {
        data: {
            status: 'running',
        },
    });
    expect(response.status()).toBe(404);
});
