const { test, expect } = require('@playwright/test');
const { createJob } = require('../helpers/post.job.js');

test('GET - existing job', async ({ request }) => {
    const { body: job } = await createJob(request);

    const response = await request.get(`/jobs/${job.id}`);

    expect(response.status()).toBe(200);

    const received = await response.json();

    expect(received.id).toBe(job.id);
    expect(received.title).toBe(job.title);
    expect(received.priority).toBe(job.priority);
});

test('GET - non-existing job', async ({ request }) => {
    const response = await request.get('/jobs/job-999');
    expect(response.status()).toBe(404);
});
