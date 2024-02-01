import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entity/level.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelModel: Repository<Level>,
  ) {}

  async levelSeeder() {
    const predefinedLevels = [
      { name: 'rabbit', threshold: 30000 },
      { name: 'wolf', threshold: 50000 },
      { name: 'lion', threshold: 100000 },
      { name: 'goat', threshold: 1000000 },
    ];

    const existingLevels = await this.levelModel.find();

    if (existingLevels.length > 0) {
      throw new BadRequestException('Levels already seeded');
    }

    return await this.levelModel.save(predefinedLevels);
  }

  async create(requestData) {
    const existingLevels = await this.levelModel.find({
      where: { name: requestData.name },
    });

    if (existingLevels.length > 0) {
      throw new BadRequestException('Levels already exist');
    }

    const newLevel = this.levelModel.create({ ...requestData });
    return await this.levelModel.save(newLevel);
  }

  async paginate(query: any): Promise<{
    response: Level[];
    pagination: { total: number; currentPage: number; size: number };
  }> {
    let { currentPage, size, sortOrder } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

    delete query.currentPage;
    delete query.size;
    delete query.sort;
    delete query.type;

    const queryBuilder = this.levelModel.createQueryBuilder();

    const count = await queryBuilder.getCount();
    const response = await queryBuilder
      .skip(size * (currentPage - 1))
      .take(size)
      .orderBy('createdAt', sortOrder)
      .getMany();

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async getAllLevels() {
    return await this.levelModel.find();
  }

  async update(id, requestData) {
    try {
      const existingLevel = await this.levelModel.findOne({
        where: {
          id: id,
        },
      });

      if (!existingLevel) {
        throw new NotFoundException('Level not found');
      }

      const updatedLevel = this.levelModel.merge(existingLevel, requestData);

      return await this.levelModel.save(updatedLevel);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async delete(id): Promise<void> {
    try {
      const existingLevel = await this.levelModel.findOne({
        where: {
          id: id,
        },
      });

      if (!existingLevel) {
        throw new NotFoundException('Level not found');
      }

      await this.levelModel.remove(existingLevel);

      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
