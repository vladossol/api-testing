const { test, expect } = require('@playwright/test');
const { createJob, getJob } = require('../helpers/helpers.js');

test('DELETE — pending job can be deleted', async ({ request }) => {
    // Creating test job
    const newJob = await createJob(request, 'New job', 'low');
    const job = await newJob.json();

    // Deleteing test job
    const deleteResponse = await request.delete(`/jobs/${job.id}`);

    // Assertions
    expect(deleteResponse.status()).toBe(204);
    const getResponse = await getJob(request, job.id);
    expect(getResponse.status()).toBe(404);
});

test('DELETE — running job cannot be deleted', async ({ request }) => {
    // Creating test job
    const newJob = await createJob(request, 'Test job', 'high');
    const job = await newJob.json();

    // Update status to running
    const updateResponse = await request.patch(`/jobs/${job.id}`, {
        data: {
            status: 'running',
        },
    });

    expect(updateResponse.status()).toBe(200);

    // Trying to delete
    const deleteResponse = await request.delete(`/jobs/${job.id}`);

    // Assertions
    expect(deleteResponse.status()).toBe(400);
    const getResponse = await getJob(request, job.id);
    expect(getResponse.status()).toBe(200);
    const fetchedJob = await getResponse.json();
    expect(fetchedJob.status).toBe('running');
});

test('DELETE — non-existent job returns 404', async ({ request }) => {
    const fakeJobId = 'job-does-not-exist';
    const response = await request.delete(`/jobs/${fakeJobId}`);
    expect(response.status()).toBe(404);
});
