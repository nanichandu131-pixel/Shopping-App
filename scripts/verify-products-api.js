async function run() {
    const api = process.env.API_URL || 'http://localhost:5000';
    console.log('Using API_URL=', api);
    try {
        const resp = await fetch(`${api.replace(/\/$/, '')}/api/products?limit=100`);
        if (!resp.ok) throw new Error(`products list failed: ${resp.status}`);
        const json = await resp.json();
        const items = json.items || [];
        console.log('Found products:', items.length);
        for (const p of items) {
            try {
                const h = await fetch(`${api.replace(/\/$/, '')}/api/products/${p._id}/price-history`);
                const hj = h.ok ? await h.json() : { history: [] };
                console.log(`product ${p._id} | title: ${p.title} | priceHistory: ${hj.history ? hj.history.length : 0}`);
            } catch (e) {
                console.error('error fetching history for', p._id, e.message);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('API verification failed:', err.message);
        process.exit(1);
    }
}

run();