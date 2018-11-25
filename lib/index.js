"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chalk_1 = require("chalk");
const tag = chalk_1.default.hex('D1D2FD')('[routeMapper]');
exports.createRouter = function (routes, postAsyncHandlers) {
    const router = express_1.Router();
    console.log(`${tag} Following routes (%s) will be registered with postAsyncHandlers (%s)`, routes.length, postAsyncHandlers.length);
    routes.map((route) => {
        console.debug(`${tag} Route is registered: [%s] ${chalk_1.default.green('%s')}`, route.method, route.path);
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
