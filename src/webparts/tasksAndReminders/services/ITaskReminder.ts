import { IPerson } from './IPerson';

export interface ITaskReminder {
    id: number | undefined;
    title: string | undefined;
    date: Date | undefined;
    reminder: boolean | undefined;
    person: IPerson;
}