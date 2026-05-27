import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { SessionModule } from '../session/session.module';

@Module({
  controllers: [PersonController],
  providers: [PersonService],
  imports: [SessionModule],
  exports: [PersonService],
})
export class PersonModule {}
