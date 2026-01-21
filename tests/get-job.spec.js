const { test, expect } = require('@playwright/test');
const { createJob, getJob } = require('../helpers/helpers.js');

test('GET - existing job', async ({ request }) => {
    const createResponse = await createJob(request, 'Test Job', 'high');
    const job = await createResponse.json();
    
    const response = await getJob(request, job.id);
    expect(response.status()).toBe(200);
    
    const received = await response.json();
    expect(received).toMatchObject(job);
});

test('GET - non-existing job', async ({ request }) => {
    const response = await getJob(request, 'non-existent-id');
    expect(response.status()).toBe(404);
});
