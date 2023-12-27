import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // constructor() {
  //   super({
  //     log: ['error', 'info', 'query', 'warn'],
  //   });

  //   // @ts-expect-error - this is a private property
  //   super.$on('query', (e) => {
  //     // @ts-expect-error - this is a private property
  //     console.verbose('Query: ' + e.query);
  //     // @ts-expect-error - this is a private property
  //     console.debug('Duration: ' + e.duration + 'ms');
  //   });

  //   // this.$extends({
  //   //   query: {
  //   //     $allOperations({ model, operation, args, query }) {
  //   //       /* your custom logic for modifying all Prisma Client operations here */
  //   //       if (operation.includes('find')) {
  //   //         return this.cache.cachedValueOrFetch(
  //   //           {
  //   //             module: DbService.name,
  //   //             functionName: operation,
  //   //             model,
  //   //             args: JSON.stringify(args),
  //   //           },
  //   //           () => {
  //   //             return query(args);
  //   //           },
  //   //           5 * _1_SECOND,
  //   //         );
  //   //       }
  //   //       return query(args);
  //   //     },
  //   //   },
  //   // });
  // }

  async onModuleInit() {
    // Maybe we can insert ssh tunnel here
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-expect-error - this is a private property
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
