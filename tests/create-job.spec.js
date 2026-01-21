const { test, expect } = require('@playwright/test');
const { createJob } = require('../helpers/helpers.js');

test.describe('POST - positive scenarios', () => {

  const title99 = 'A'.repeat(99);
  const title100 = 'A'.repeat(100);

  test('POST - high priority', async ({ request }) => {
    const response = await createJob(request, 'Test Job', 'high');

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.title).toBe('Test Job');
    expect(body.priority).toBe('high');
    expect(body.status).toBe('pending');
    expect(body).toHaveProperty('created_at');
  });

  test('POST - medium priority', async ({ request }) => {
    const response = await createJob(request, 'Test Job', 'medium');

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.priority).toBe('medium');
  });

  test('POST - low priority', async ({ request }) => {
    const response = await createJob(request, 'Test Job', 'low');

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.priority).toBe('low');
  });

  test('POST - 1 char title', async ({ request }) => {
    const response = await createJob(request, 'A', 'high');

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('A');
  });

  test('POST - 99 chars title', async ({ request }) => {
    const response = await createJob(request, title99, 'high');

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe(title99);
  });

  test('POST - 100 chars title', async ({ request }) => {
    const response = await createJob(request, title100, 'high');

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe(title100);
  });
});

test.describe('POST - negative scenarios', () => {

  const title101 = 'A'.repeat(101);

  test('POST - missing title', async ({ request }) => {
    const response = await createJob(request, '', 'high');
    expect(response.status()).toBe(400);
  });

  test('POST - invalid priority', async ({ request }) => {
    const response = await createJob(request, 'Test job', 'urgent');
    expect(response.status()).toBe(400);
  });

  test('POST - missing priority', async ({ request }) => {
    const response = await createJob(request, 'Test job', '');
    expect(response.status()).toBe(201);
    const body = await response.json();
    // From API spec: "Missing priority uses default" - I assume this should be a medium priority
    expect(body.priority).toBe('medium');
  });

  test('POST - over 100 chars title', async ({ request }) => {
    const response = await createJob(request, title101, 'high');
    expect(response.status()).toBe(400);
  });

  test('POST - banned scam', async ({ request }) => {
    const response = await createJob(request, 'This is a scam', 'high');
    expect(response.status()).toBe(400);
  });

  test('POST - banned miracle', async ({ request }) => {
    const response = await createJob(request, 'This is a miracle', 'high');
    expect(response.status()).toBe(400);
  });

  test('POST - banned guaranteed', async ({ request }) => {
    const response = await createJob(request, 'This is a guaranteed success', 'high');
    expect(response.status()).toBe(400);
  });

  test('POST - banned free', async ({ request }) => {
    const response = await createJob(request, 'This is free money', 'high');
    expect(response.status()).toBe(400);
  });

  test('POST - multiply banned words', async ({ request }) => {
    const response = await createJob(request, 'This is guaranteed free miracle, not scam', 'high');
    expect(response.status()).toBe(400);
  });
});

