"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const express_1 = require("express");
const server_1 = require("jege/server");
const log = server_1.logger('[express-route-mapper]');
exports.createRouter = function (routes, postAsyncHandlers) {
    const router = express_1.Router();
    log('Following routes (%s) will be registered with postAsyncHandlers (%s)', routes.length, postAsyncHandlers.length);
    routes.map((route) => {
        log(`Route is registered: [%s] ${chalk_1.default.green('%s')}`, route.method, route.path);
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
