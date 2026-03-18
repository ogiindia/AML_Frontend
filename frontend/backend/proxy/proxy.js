
const { default: express } = await import('express');

const { createProxyMiddleware } = await import('http-proxy-middleware');

export function startProxyServer(configs, port = 3000) {
    const app = express();
    const proxyList = Array.isArray(configs) ? configs : [configs];

    proxyList.forEach((config) => {
        const {
            route = '/proxy',
            target,
            pathRewrite = { [`^${route}`]: '' },
            ...rest
        } = config;

        if (!target) throw new Error(`Missing target in proxy config`);

        app.use(
            route,
            createProxyMiddleware({
                target,
                changeOrigin: true,
                logLevel: 'info',
                pathRewrite,
                ...rest,
                onError(err, req, res) {
                    console.error(`Proxy Error for ${route} : `, err.message);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Proxy Error', details: err.message }));
                },
            })
        )

    });

    app.listen((port, { }) => {
        console.log(`proxy Server running on http://localhost:${port}`)
    });
    return app;

}


