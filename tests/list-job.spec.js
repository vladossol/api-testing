const { test, expect } = require('@playwright/test');
const { createJob, setupJobs } = require('../helpers/helpers.js');

test('LIST — returns all jobs', async ({ request }) => {
    // Creating test jobs
    const { job1, job2 } = await setupJobs(request);
    const listResponse = await request.get('/jobs');
    expect(listResponse.status()).toBe(200);

    // Assertions
    const jobs = await listResponse.json();
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.length).toBeGreaterThanOrEqual(2);
});

test.describe('LIST - status filtering', () => {

    test('LIST — filters by pending status correctly', async ({ request }) => {
        // Creating test jobs
        const { job1, job2 } = await setupJobs(request);

        // Updating 2nd job status to 'running'
        const updateResponse = await request.patch(`/jobs/${job2.id}`, {
            data: {
                status: 'running',
            },
        });

        // Assertions
        expect(updateResponse.status()).toBe(200);

        const listResponse = await request.get('/jobs?status=pending');
        expect(listResponse.status()).toBe(200);

        const jobs = await listResponse.json();
        jobs.forEach(job => {
            expect(job.status).toBe('pending');
        });
    });

    test('LIST — filters by running status correctly', async ({ request }) => {
        // Creating test jobs
        const { job1, job2 } = await setupJobs(request);

        // Updating 2nd job status to 'running'
        const updateResponse = await request.patch(`/jobs/${job2.id}`, {
            data: {
                status: 'running',
            },
        });

        // Assertions
        expect(updateResponse.status()).toBe(200);

        const listResponse = await request.get('/jobs?status=running');
        expect(listResponse.status()).toBe(200);

        const jobs = await listResponse.json();
        jobs.forEach(job => {
            expect(job.status).toBe('running');
        });
    });

    test('LIST — filters by completed status correctly', async ({ request }) => {
        // Creating test jobs
        const { job1, job2 } = await setupJobs(request);

        // Updating 2nd job status to 'completed'
        const updateResponse = await request.patch(`/jobs/${job2.id}`, {
            data: {
                status: 'completed',
            },
        });

        // Assertions
        expect(updateResponse.status()).toBe(200);

        const listResponse = await request.get('/jobs?status=completed');
        expect(listResponse.status()).toBe(200);

        const jobs = await listResponse.json();
        jobs.forEach(job => {
            expect(job.status).toBe('completed');
        });
    });

    test('LIST — filters by failed status correctly', async ({ request }) => {
        // Creating test jobs
        const { job1, job2 } = await setupJobs(request);

        // Updating 2nd job status to 'failed'
        const updateResponse = await request.patch(`/jobs/${job2.id}`, {
            data: {
                status: 'failed',
            },
        });

        // Assertions
        expect(updateResponse.status()).toBe(200);

        const listResponse = await request.get('/jobs?status=failed');
        expect(listResponse.status()).toBe(200);

        const jobs = await listResponse.json();
        jobs.forEach(job => {
            expect(job.status).toBe('failed');
        });
    });
});


test.describe('LIST - priority filtering', () => {

    test('LIST — filter by high priority', async ({ request }) => {
        // Creating test jobs
        const { job1, job2, job3 } = await setupJobs(request);
        const listResponse = await request.get('/jobs?priority=high');
        expect(listResponse.status()).toBe(200);
        // Assertions
        const jobs = await listResponse.json();
        jobs.forEach(job => {
            expect(job.priority).toBe('high');
        });
    });

    test('LIST — filter by medium priority', async ({ request }) => {
        // Creating test jobs
        const { job1, job2, job3 } = await setupJobs(request);
        const listResponse = await request.get('/jobs?priority=medium');
        expect(listResponse.status()).toBe(200);
        // Assertions
        const jobs = await listResponse.json();
        jobs.forEach(job => {
            expect(job.priority).toBe('medium');
        });
    });

    test('LIST — filter by low priority', async ({ request }) => {
        // Creating test jobs
        const { job1, job2, job3 } = await setupJobs(request);
        const listResponse = await request.get('/jobs?priority=low');
        expect(listResponse.status()).toBe(200);
        // Assertions
        const jobs = await listResponse.json();
        jobs.forEach(job => {
            expect(job.priority).toBe('low');
        });
    });
});

test('LIST — invalid status filter returns 400', async ({ request }) => {
    const response = await request.get('/jobs?status=invalid');
    expect(response.status()).toBe(400);
});

test('LIST — limit over 100 should be capped to 100', async ({ request }) => {
    // Creating multiple test jobs
    test.setTimeout(60000);
    for (let i = 0; i < 110; i++) {
        await createJob(request, `Job ${i}`, 'low');
    }
    const response = await request.get('/jobs?limit=150');

    // Assertions
    expect(response.status()).toBe(200);
    const jobs = await response.json();
    expect(jobs.length).toBeLessThanOrEqual(100);
});
