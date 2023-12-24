import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplatesService],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a string', async () => {
    const template = await service.getTemplate('sample.html', {
      title: 'Test',
      content: 'Test',
    });
    expect(typeof template).toBe('string');
    console.log(template);
  });
});
