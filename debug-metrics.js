
const { fetchMetrics } = require('./src/app/actions');

async function run() {
    try {
        const metrics = await fetchMetrics();
        console.log('Metrics:', metrics);
    } catch (error) {
        console.error('Error:', error);
    }
}

run();
