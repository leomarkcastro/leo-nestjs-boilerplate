import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Get()
  @ApiResponse({ status: 201, description: 'OK' })
  async ping_healthCheck() {
    return 'OK';
  }
}
