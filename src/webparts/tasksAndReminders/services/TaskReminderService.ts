import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IItemAddResult, sp } from '@pnp/sp/presets/all';
import { ITaskReminder } from './ITaskReminder';
import PersonService from './PersonService';

export default class TasksService {
    private currentContext: WebPartContext;
    private listName: string = 'Tasks and Reminders';

    constructor(context: WebPartContext) {
        this.currentContext = context;

        sp.setup({ spfxContext: context });
    }

    public add = async (task: ITaskReminder): Promise<number> => {
        return await sp.web.lists.getByTitle(this.listName).items.add(
            {
                Title: task.title,
                TasksAndReminderDate: task.date,
                TasksAndReminderReminder: task.reminder
            }).then((response: IItemAddResult) => {
                return response.data;
            }).then((data: any) => {
                return data.Id;
            }).catch((error: any) => {
                console.log(error);

                return 0;
            });
    }

    public delete = async (id: number): Promise<any> => {
        return await sp.web.lists.getByTitle(this.listName).items.getById(id).delete()
            .then((response: any) => {
                return response;
            }).then((data: any) => {
                return data;
            }).catch((error: any) => {
                console.log(error);

                return 0;
            });
    }

    public get = async (id: number): Promise<ITaskReminder> => {
        return await sp.web.lists.getByTitle(this.listName).items.getById(id).get()
            .then((response: any) => {
                return response;
            }).then(async (data: any) => {
                const person = await new PersonService().getPerson(this.currentContext, data.AuthorId);

                return {
                    id: data.Id,
                    title: data.Title,
                    date: data.TasksAndReminderDate,
                    reminder: data.TasksAndReminderReminder,
                    person: person
                } as ITaskReminder;
            }).catch((error: any) => {
                console.log(error);

                return null;
            });
    }

    public list = async (): Promise<ITaskReminder[]> => {
        return await sp.web.lists.getByTitle(this.listName).items.get()
            .then((response: any[]) => {
                return response;
            }).then(async (data: any[]) => {
                let list: ITaskReminder[] = [];

                for await (const item of data) {
                    const person = await new PersonService().getPerson(this.currentContext, item.AuthorId);

                    list.push({
                        id: item.Id,
                        title: item.Title,
                        date: new Date(item.TasksAndReminderDate.toString()),
                        reminder: item.TasksAndReminderReminder,
                        person: person
                    } as ITaskReminder);
                }

                return list;
            }).catch((error: any) => {
                console.log(error);

                return [];
            });
    }

    public update = async (id: number, task: ITaskReminder): Promise<ITaskReminder> => {
        await sp.web.lists.getByTitle(this.listName).items.getById(id).update(
            {
                Title: task.title,
                TasksAndReminderDate: task.date,
                TasksAndReminderReminder: task.reminder
            }).then((response: IItemAddResult) => {

            }).then((data: any) => {

            }).catch((error: any) => {
                console.log(error);
            });

        return await this.get(id);
    }
}