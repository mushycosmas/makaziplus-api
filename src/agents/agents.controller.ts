import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  // 👤 GET ALL AGENTS (WITH PAGINATION)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.agentsService.findAll(
      Number(page),
      Number(limit),
    );
  }

  // 👤 GET SINGLE AGENT
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(Number(id));
  }

  // 🏠 GET AGENT PROPERTIES (WITH PAGINATION)
  @Get(':id/properties')
  getProperties(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.agentsService.getAgentProperties(
      Number(id),
      Number(page),
      Number(limit),
    );
  }

  // 🔁 PROMOTE USER TO AGENT
  @Patch(':id/make-agent')
  makeAgent(@Param('id') id: string) {
    return this.agentsService.makeAgent(Number(id));
  }
}