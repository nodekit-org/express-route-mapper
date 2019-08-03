import * as express from 'express';
import { logger } from 'jege/server';

import {
  createRouter,
  Route,
} from '../lib/index';

const log = logger('[express-route-mapper]');
const PORT = 5100;

const app = express();

const routes0: Route<string, null>[] = [
  {
    action: () => {
      return Promise.resolve('debug');
    },
    method: 'get',
    path: '/debug',
  },
];


const routes1: Route<string, any>[] = [
  <RouteWithParam<{ foo: string }>>{
    action: async (a: {foo: string }) => {
      return 'power';
    },
    createParam: (req: express.Request) => {
      return {
        foo: '1',
      };
    },
    method: 'get',
    path: '/seed',
  },
  <RouteWithParam<string>>{
    action: async () => {
      return 'due';
    },
    createParam: (req: express.Request) => {
      return '1';
    },
    method: 'post',
    path: '/comment',
  },
];

function respond(req: express.Request, res: express.Response, next: express.NextFunction) {
  return function (data) {
    res.status(200)
      .send({
        data,
      });
    return data;
  };
}

const v0 = createRouter(routes0, [ respond ]);
const v1 = createRouter(routes1, [ respond ]);

app.use((req, res, next) => {
  log(req.url, new Date());
  next();
});

app.use('/v0', v0);
app.use('/v1', v1);

app.listen(PORT, function(err) {
  if (err) {
    log('err %o', err);
  }
  log('Listening at port: %s', PORT);
});

interface Route1Param {
  foo: number;
}

type RouteWithParam<P> = Route<string, P>;
