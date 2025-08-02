import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobsManagerService } from './jobs-manager.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      inject: [ConfigService],
      name: 'tmdb_population_data',
      useFactory: async (configService: ConfigService) => {
        return {
          url: configService.get('caching.redisURL'),
        };
      },
    }),
  ],
  exports: [JobsManagerService],
  providers: [JobsManagerService],
})
export class JobsManagerModule {}
