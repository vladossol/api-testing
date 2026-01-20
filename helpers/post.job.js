async function createJob(request) {
    const response = await request.post('/jobs', {
        data: {
            title: 'Temporary job',
            priority: 'medium',
        },
    });

    const body = await response.json();

    return {
        response,
        body,
    };
}

module.exports = {
    createJob,
};
