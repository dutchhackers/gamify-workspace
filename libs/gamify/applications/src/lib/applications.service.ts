import { DataService } from '@gamify/data';
import { IApplication, ApplicationConverter } from '@gamify/shared';
import { Injectable } from '@nestjs/common';
import { CreateApplicationInput } from './dto/create-application.input';
import { UpdateApplicationInput } from './dto/update-application.input';

@Injectable()
export class ApplicationsService {

    constructor(private readonly data: DataService) {}

    async findMany(): Promise<IApplication[]> {
        return (await this.data.application.findMany()).map(app => ApplicationConverter.fromPrismaApplication(app));
    }

    findOne(id: number) {
        return this.data.application.findUnique({ where: { id }});
    }

    create(createApplicationInput: CreateApplicationInput) {
        return this.data.application.create({
            data: createApplicationInput
        });
    }

    update(id: number, updateApplicationInput: UpdateApplicationInput) {
        return this.data.application.update({
            where: { id },
            data: updateApplicationInput
        })
    }

    remove(id: number) {
        return this.data.application.delete({ where: { id }});
    }

    async isNameUnique(name: string): Promise<boolean> {
        const app = await this.data.application.findFirst({
            where: { name }
        });

        if (app !== null) {
            return false;
        }

        return true;
    }
}
