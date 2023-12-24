import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const data = {
    method: req.method,
    path: req.path,
    query: req.query,
    timestamp: new Date().toISOString(),
    // body: req.body,
    // headers: req.headers,
  };

  Logger.debug('Request', JSON.stringify(data));

  next();
}
