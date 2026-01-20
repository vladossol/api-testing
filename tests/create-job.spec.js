const { test, expect } = require('@playwright/test');
const longTitle = 'A9f3K2M7xQ4R8Z1bD6Yc0EJpL5NnHqSWTmUoVXiFgrCaytBdOeIPhsukwjlvG';

test.describe('job creation - positive scenarios', () => {

  test('create job - high priority', async ({ request }) => {
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

  test('create job - medium priority', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'Process code',
        priority: 'medium',
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.priority).toBe('medium');
  });

  test('create job - low priority', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'Process API',
        priority: 'low',
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.priority).toBe('low');
  });

  test('create job - 1 char title', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'A',
        priority: 'high',
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('A');
  });

  test('create job - 100 chars title', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: longTitle,
        priority: 'high',
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe(longTitle);
  });
});

test.describe('job creation - negative scenarios', () => {

  test('create job - missing title', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: '',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('create job - invalid priority', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'Process test',
        priority: 'Urgent',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('create job - missing priority', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'Process string',
        priority: '',
      },
    });
    expect.soft(response.status()).toBe(201);
    const body = await response.json();
    // From API spec: "Missing priority uses default" - I assume this should be high priority
    expect.soft(body.priority).toBe('high');
  });

  test('create job - over 100 chars title', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: longTitle + '1',
        priority: 'high',
      },
    });
    expect.soft(response.status()).toBe(400);
  });

  test('create job - banned scam', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'This is a scam',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('create job - banned miracle', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'This is a miracle',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('create job - banned guaranteed', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'This is a guaranteed success',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('create job - banned free', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'This is free money',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });
});

