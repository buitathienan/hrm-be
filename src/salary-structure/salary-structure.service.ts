import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSalaryStructureDto } from './dto/create-salary-structure.dto';
import { AddSalaryStructureComponentsDto } from './dto/add-salary-structure-component.dto';
import { SalaryComponentCalculationType } from 'src/generated/prisma/enums';
import { UpdateSalaryStructureComponent } from './dto/update-salary-structure-component.dto';

@Injectable()
export class SalaryStructureService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSalaryStructureDto) {
    return this.prisma.salaryStructure.create({
      data: {
        name: dto.name,
        code: dto.code,
      },
    });
  }

  async addComponents(id: number, dto: AddSalaryStructureComponentsDto) {
    // Transaction
    await this.prisma.$transaction(async (tx) => {
      const salaryStructure = await tx.salaryStructure.findUnique({
        where: { id },
      });

      if (!salaryStructure)
        throw new NotFoundException('Salary structure not found');

      const componentIds = dto.components.map(
        (component) => component.salaryComponentId,
      );
      // Check duplicate component id using set
      const uniqueComponentIds = new Set(componentIds);
      if (uniqueComponentIds.size !== componentIds.length)
        throw new BadRequestException('Duplicate salary component');

      const salaryComponents = await tx.salaryComponent.findMany({
        where: {
          id: { in: componentIds },
        },
      });

      if (salaryComponents.length !== componentIds.length)
        throw new NotFoundException('One or more salary components not found');

      if (salaryComponents.some((element) => !element.isActive))
        throw new BadRequestException(`Some components are inactive`);

      for (const component of dto.components) {
        if (
          component.calculationType !==
            SalaryComponentCalculationType.BASE_SALARY &&
          component.value === undefined
        )
          throw new BadRequestException('Value property is missing');
        else if (
          component.calculationType ===
            SalaryComponentCalculationType.BASE_SALARY &&
          component.value !== undefined
        )
          throw new BadRequestException(
            'Cannot set value on base salary calculation type',
          );
      }

      const existingComponent = await tx.salaryStructureComponent.findFirst({
        where: {
          salaryStructureId: id,
          salaryComponentId: {
            in: componentIds,
          },
        },
      });

      if (existingComponent)
        throw new BadRequestException(
          'Component already added in salary structure',
        );

      const data = dto.components.map((component) => ({
        ...component,
        salaryStructureId: id,
      }));

      const result = await tx.salaryStructureComponent.createMany({ data });
      return {
        message: 'Salary components added successfully',
        count: result.count,
      };
    });
  }

  async findAll() {
    return this.prisma.salaryStructure.findMany({
      include: {
        components: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const salaryStructure = await this.prisma.salaryStructure.findUnique({
      where: { id },
      include: { components: true },
    });
    if (!salaryStructure) {
      throw new NotFoundException('Salary structure not found');
    }
    return salaryStructure;
  }

  async updateComponent(
    structureId: number,
    componentId: number,
    dto: UpdateSalaryStructureComponent,
  ) {
    const salaryStructure =
      await this.prisma.salaryStructureComponent.findFirst({
        where: {
          salaryStructureId: structureId,
          salaryComponentId: componentId,
        },
      });

    if (!salaryStructure)
      throw new NotFoundException(
        'Cannot found salary component in salary structure',
      );

    // if (
    //   dto.calculationType === SalaryComponentCalculationType.BASE_SALARY &&
    //   dto.value !== undefined
    // ) {
    //   throw new BadRequestException(
    //     'Base salary calculation type cannot have value property',
    //   );
    // } else if (
    //   dto.calculationType !== undefined &&
    //   dto.calculationType !== SalaryComponentCalculationType.BASE_SALARY &&
    //   dto.value === undefined
    // ) {
    //   throw new BadRequestException('Value property is missing');
    // } else if (
    //   dto.value !== undefined &&
    //   dto.calculationType === undefined &&
    //   salaryStructure.calculationType ===
    //     SalaryComponentCalculationType.BASE_SALARY
    // ) {
    //   throw new BadRequestException(
    //     'Value property is only allowed for non-base salary calculation types',
    //   );
    // }
    const finalCalculationType =
      dto.calculationType ??
      (dto.calculationType !== salaryStructure.calculationType
        ? dto.calculationType === SalaryComponentCalculationType.BASE_SALARY
          ? SalaryComponentCalculationType.BASE_SALARY
          : dto.calculationType
        : undefined);

    return this.prisma.salaryStructureComponent.update({
      data: {
        sortOrder: dto.sortOrder,
        calculationType: dto.calculationType,
        value:
          salaryStructure.calculationType !==
            SalaryComponentCalculationType.BASE_SALARY &&
          dto.calculationType === SalaryComponentCalculationType.BASE_SALARY
            ? null
            : dto.value,
      },
      where: { id: salaryStructure.id },
    });
  }
}
