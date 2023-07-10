import { Test, TestingModule } from '@nestjs/testing';

import { HttpAdapterModule } from '@shared/adapters/http/axios/http.module';
import { OrderRepositoryModule } from '../../adapters/repository/order.module';

import { GetSeasonByYearController } from '../useCases/CreateOrder/CreateOrder.controller';
import { GetSeasonByYearUseCase } from '../useCases/CreateOrder/CreateOrder.usecase';

import { FormulaOneHttpAdapter } from '../../adapters/http/axios.adapter';
import { OrderRepositoryAdapter } from '../../adapters/repository/order.adapter';

import { Logger } from './config/logger';

import { CoreModule } from './core/core.module';
import CoreController from './core/core.controller';

import { OrderModule } from './api/api.module';
import { ApiController } from './api/api.controller';
import ApiService from './api/api.service';

describe('CoreController', () => {
  let appController: CoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    appController = app.get<CoreController>(CoreController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthCheck().status).toBe('success');
    });
  });
});

describe('ApiController', () => {
  let appController: ApiController;

  const mockRepository = {
    orders: {
      create: (items: any) =>
        Promise.resolve({
          items,
        }),
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [OrderModule, HttpAdapterModule, OrderRepositoryModule, Logger],
      controllers: [ApiController],
      providers: [ApiService, OrderRepositoryAdapter, GetSeasonByYearController, GetSeasonByYearUseCase],
    })
      .overrideProvider(OrderRepositoryAdapter)
      .useValue(mockRepository)
      .compile();

    appController = app.get<ApiController>(ApiController);
  });

  describe('getSeasonByYear', () => {
    it('should return "success"', async () => {
      const dto = {
        items: ['hola', 'mundo'],
      };
      expect(await (await appController.getSeasonByYear(dto)).status).toBe('success');
    });
  });
});
