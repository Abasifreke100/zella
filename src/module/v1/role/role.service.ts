import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from '../../../common/constants/user.constants';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleModel: Repository<Role>,
  ) {}

  async create(requestData) {
    const existingRoles = await this.roleModel.find({
      where: { name: requestData.name },
    });

    if (existingRoles.length > 0) {
      throw new BadRequestException('Roles already seeded');
    }

    const newRole = this.roleModel.create({ ...requestData });
    return await this.roleModel.save(newRole);
  }

  async roleSeeder() {
    const rolesToSeed = [
      {
        name: RoleEnum.ADMIN,
      },
      {
        name: RoleEnum.CUSTOMER,
      },
    ];

    const existingRoles = await this.roleModel.find({
      where: rolesToSeed.map((role) => ({ name: role.name })),
    });

    if (existingRoles.length > 0) {
      throw new BadRequestException('Roles already seeded');
    }

    return await this.roleModel.save(rolesToSeed);
  }

  async paginate(query: any): Promise<{
    response: Role[];
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

    const queryBuilder = this.roleModel.createQueryBuilder();

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

  async update(id, requestData) {
    try {
      const existingRole = await this.roleModel.findOne({
        where: {
          id: id,
        },
      });

      if (!existingRole) {
        throw new NotFoundException('Role not found');
      }

      const updatedRole = this.roleModel.merge(existingRole, requestData);

      return await this.roleModel.save(updatedRole);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async delete(id): Promise<void> {
    try {
      const existingRole = await this.roleModel.findOne({
        where: {
          id: id,
        },
      });

      if (!existingRole) {
        throw new NotFoundException('Role not found');
      }

      await this.roleModel.remove(existingRole);

      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    const role = await this.roleModel.findOne({
      where: {
        id: id,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
