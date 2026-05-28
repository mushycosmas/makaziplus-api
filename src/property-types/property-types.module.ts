import { Module } from '@nestjs/common';
import { PropertyTypesController } from './property-types.controller';
import { PropertyTypesService } from './property-types.service';

@Module({
  controllers: [PropertyTypesController],
  providers: [PropertyTypesService]
})
export class PropertyTypesModule {}
