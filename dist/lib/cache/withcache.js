"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCache = withCache;
const init_1 = require("./init");
function withCache(ttl = 3600) {
    return async (req, res, next) => {
        let key = `${req.method}: ${req.originalUrl}`;
        const cached = await init_1.cacheProvider.get(key);
        if (cached) {
            res.setHeader('X-cache', "HIT");
            return res.json(JSON.parse(cached));
        }
        const originalJson = res.json.bind(res);
        res.json = ((body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                init_1.cacheProvider.set(key, JSON.stringify(body), ttl);
                res.setHeader('X-Cache', "MISS");
            }
            return originalJson(body);
        });
        next();
    };
}
