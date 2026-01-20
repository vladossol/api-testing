const { test, expect } = require('@playwright/test');
const longTitle = 'A9f3K2M7xQ4R8Z1bD6Yc0EJpL5NnHqSWTmUoVXiFgrCaytBdOeIPhsukwjlvG';

test.describe('POST - positive scenarios', () => {

  test('POST - high priority', async ({ request }) => {
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

  test('POST - medium priority', async ({ request }) => {
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

  test('POST - low priority', async ({ request }) => {
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

  test('POST - 1 char title', async ({ request }) => {
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

  test('POST - 100 chars title', async ({ request }) => {
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

test.describe('POST - negative scenarios', () => {

  test('POST - missing title', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: '',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('POST - invalid priority', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'Process test',
        priority: 'Urgent',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('POST - missing priority', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'Process string',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    // From API spec: "Missing priority uses default" - I assume this should be a medium priority
    expect(body.priority).toBe('medium');
  });

  test('POST - over 100 chars title', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: longTitle + '1',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('POST - banned scam', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'This is a scam',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('POST - banned miracle', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'This is a miracle',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('POST - banned guaranteed', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'This is a guaranteed success',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('POST - banned free', async ({ request }) => {
    const response = await request.post('/jobs', {
      data: {
        title: 'This is free money',
        priority: 'high',
      },
    });
    expect(response.status()).toBe(400);
  });
});

