const { test, expect } = require('@playwright/test');

test('create job - happy path', async ({ request }) => {
  const response = await request.post('/jobs', {
    data: {
      title: 'Process data',
      priority: 'high',
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body).toHaveProperty('id');
  expect(body.title).toBe('Process data');
  expect(body.priority).toBe('high');
  expect(body.status).toBe('pending');
  expect(body).toHaveProperty('created_at');
});
