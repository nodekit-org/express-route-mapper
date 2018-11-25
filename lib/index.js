"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chalk_1 = require("chalk");
exports.createRouter = function (routes, postAsyncHandlers) {
    const router = express_1.Router();
    console.log(`[routeMapper] postAsyncHandlers (%s), routes (%s)`, postAsyncHandlers.length, routes.length);
    routes.map((route) => {
        console.debug(`[routeMapper] Route is registered: [%s] ${chalk_1.default.green('%s')}`, route.method, route.path);
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
    return router;
};
