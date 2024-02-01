import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entity/badge.entity';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge)
    private badgeModel: Repository<Badge>,
  ) {}

  async badgeSeeder() {
    const predefinedBadges = [
      { name: 'silver', threshold: 30000 },
      { name: 'gold', threshold: 50000 },
      { name: 'diamond', threshold: 100000 },
    ];

    const existingBadges = await this.badgeModel.find();

    if (existingBadges.length > 0) {
      throw new BadRequestException('Badges already seeded');
    }

    return await this.badgeModel.save(predefinedBadges);
  }

  async create(requestData) {
    const existingBadges = await this.badgeModel.find({
      where: { name: requestData.name },
    });

    if (existingBadges.length > 0) {
      throw new BadRequestException('Badge already exist');
    }

    const badge = this.badgeModel.create({ ...requestData });
    return await this.badgeModel.save(badge);
  }

  async paginate(query: any): Promise<{
    response: Badge[];
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

    const queryBuilder = this.badgeModel.createQueryBuilder();

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

  async getAllBadges() {
    return await this.badgeModel.find();
  }

  async update(id, requestData) {
    try {
      const existingBadge = await this.badgeModel.findOne({
        where: {
          id: id,
        },
      });

      if (!existingBadge) {
        throw new NotFoundException('Badge not found');
      }

      const updatedBadge = this.badgeModel.merge(existingBadge, requestData);

      return await this.badgeModel.save(updatedBadge);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async delete(id): Promise<void> {
    try {
      const existingBadge = await this.badgeModel.findOne({
        where: {
          id: id,
        },
      });

      if (!existingBadge) {
        throw new NotFoundException('Badge not found');
      }

      await this.badgeModel.remove(existingBadge);

      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
