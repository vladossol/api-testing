/**
@param { string } jobTitle
@param { string } priority
*/
async function createJob(request, jobTitle, priority) {
    const response = await request.post('/jobs', {
        data: {
            title: jobTitle,
            priority: priority,
        },
    });

    return response;
}

async function getJob(request, jobId) {
    return await request.get(`/jobs/${jobId}`);
}

async function setupJobs(request) {
    const job1Response = await createJob(request, 'First job', 'high');
    const job2Response = await createJob(request, 'Second job', 'medium');
    const job3Response = await createJob(request, 'Third job', 'low');

    const job1 = await job1Response.json();
    const job2 = await job2Response.json();
    const job3 = await job3Response.json();

    return { job1, job2, job3 };
}

module.exports = { createJob, getJob, setupJobs };
