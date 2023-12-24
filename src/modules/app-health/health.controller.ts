import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  async healthCheck() {
    return 'OK';
  }
}
