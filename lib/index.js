"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chalk_1 = require("chalk");
function routeMapper(app, routeDefinitions) {
    routeDefinitions.map((rmap) => {
        registerRouter(app, rmap.mapPath, rmap.map, rmap.postAsyncHandlers);
    });
    return app;
}
exports.default = routeMapper;
;
const registerRouter = function (app, mapPath, routeMap, postAsyncHandlers) {
    const router = express_1.Router();
    console.log(`[routeMapper] mapPath: ${chalk_1.default.green('%s')}, postAsyncHandlers (%s)`, mapPath, postAsyncHandlers.length);
    routeMap.map((route) => {
        console.debug('[routeMapper] Route is registered: [%s] %s', route.method, route.path);
        router[route.method](route.path, [
            ...(route.beforeware && route.beforeware || []),
            (req, res, next) => {
                const param = route.createParam ? route.createParam(req) : null;
                postAsyncHandlers.reduce((acc, curr) => {
                    return acc.then(curr(req, res, next));
                }, route.action(param))
                    .catch(next);
            },
        ]);
    });
    app.use(mapPath, router);
};
