import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
    Checkbox, Coachmark, DatePicker, DefaultButton, Dialog, DialogFooter, DialogType, DirectionalHint, DocumentCard, DocumentCardActions, DocumentCardActivity, DocumentCardDetails, DocumentCardPreview,
    DocumentCardTitle, DocumentCardType, getTheme, ICheckbox, IconButton, IDocumentCardPreviewProps, IIconProps, ITextField, MessageBar, MessageBarType, Panel, PrimaryButton, Spinner,
    SpinnerSize, Stack, TeachingBubbleContent, TextField
} from 'office-ui-fabric-react';
const theme = getTheme();
const { palette, fonts } = theme;

import { ITasksAndRemindersProps } from './ITasksAndRemindersProps';
import { ITaskReminder } from '../services/ITaskReminder';
import TasksService from '../services/TaskReminderService';

import styles from './TasksAndReminders.module.scss';

const addIcon: IIconProps = { iconName: 'Add' };
const questionIcon: IIconProps = { iconName: 'SurveyQuestions' };

const defaultTaskIcon: IDocumentCardPreviewProps = {
    previewImages: [
        {
            previewIconProps: {
                iconName: 'AlarmClock',
                styles: {
                    root: {
                        fontSize: fonts.superLarge.fontSize,
                        color: palette.neutralLight
                    }
                },
            },
            width: 144,
        },
    ],
    styles: { previewIcon: { backgroundColor: palette.neutralLighterAlt, height: 108 } },
};

const reminderTaskIcon: IDocumentCardPreviewProps = {
    previewImages: [
        {
            previewIconProps: {
                iconName: 'AlarmClock',
                styles: {
                    root: {
                        fontSize: fonts.superLarge.fontSize,
                        color: palette.white
                    }
                },
            },
            width: 144,
        },
    ],
    styles: { previewIcon: { backgroundColor: palette.teal, height: 108 } },
};

const deleteDialogContentProps = {
    type: DialogType.normal,
    title: 'Confirm Delete',
    subText: 'Do you want to delete the current task? This process cannot be undone.',
};

const TasksAndReminders: React.FC<ITasksAndRemindersProps> = (props) => {
    const helpButtonReference = useRef<HTMLDivElement>(null);
    const reminderReference = useRef<ICheckbox>(null);
    const titleFieldReference = useRef<ITextField>(null);

    const [currentTaskToDelete, setCurrentTaskToDelete] = useState<number>(0);
    const [displayDeleteTask, setDisplayDeleteTask] = useState<boolean>(false);
    const [displayAddPanel, setDisplayAddPanel] = useState<boolean>(false);
    const [displayError, setDisplayError] = useState<boolean>(false);
    const [displayErrorUpsert, setDisplayErrorUpsert] = useState<boolean>(false);
    const [displayHelp, setDisplayHelp] = useState<boolean>(false);
    const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [panelHeaderText, setPanelHeaderText] = useState<string>('Add Task');
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
    const [tasks, setTasks] = useState<ITaskReminder[]>([]);
    const [form, setForm] = useState<ITaskReminder>({ title: '', date: selectedDate, reminder: false } as ITaskReminder);

    useEffect(() => {
        const load = async () => {
            const taskService = getTasksService();

            const tasksList = await taskService.list();

            setTasks(tasksList);
            setLoading(false);
        };

        load();
    }, []);

    const getTasksService = (): any => {
        return new TasksService(props.context);
    };

    const onActionClick = (action: string, id: number, event: React.SyntheticEvent<HTMLElement>): void => {
        event.stopPropagation();
        event.preventDefault();

        if (action === 'edit') {
            onEditClick(id);
        } else if (action === 'delete') {
            setCurrentTaskToDelete(id);
            setDisplayDeleteTask(true);
        }
    };

    const onDeleteClick = async (): Promise<any> => {
        onResetMessages();

        const taskService = getTasksService();
        const result = await taskService.delete(currentTaskToDelete) as any;

        if (result !== 0) {
            setDisplaySuccess(true);
            setTasks(tasks.filter((task) => task.id !== currentTaskToDelete));
        } else {
            setDisplayError(true);
        }

        onHideDeleteDialogClick();
    };

    const onDisplayPanelClick = (): void => {
        onResetForm();
        setPanelHeaderText('Add Task');
        setDisplayAddPanel(true);
    };

    const onEditClick = async (id: number): Promise<any> => {
        onResetMessages();

        const taskService = getTasksService();
        const result = await taskService.get(id) as ITaskReminder;

        if (result !== null) {
            setForm({ ...result });
            setSelectedDate(new Date(result.date.toString()));

            setPanelHeaderText('Edit Task');
            setDisplayAddPanel(true);
        } else {
            setDisplayError(true);
        }
    };

    const onHideDeleteDialogClick = (): void => {
        setCurrentTaskToDelete(0);
        setDisplayDeleteTask(false);
    };

    const onHidePanelClick = (): void => {
        setDisplayAddPanel(false);
    };

    const onResetForm = (): void => {
        setForm({ title: '', date: new Date, reminder: false } as ITaskReminder);
    };

    const onResetMessages = (): void => {
        setDisplayError(false);
        setDisplaySuccess(false);
        setDisplayErrorUpsert(false);
    };

    const onSubmitForm = async (): Promise<any> => {
        onResetMessages();

        if (titleFieldReference.current!.value.trim() === '' ||
            titleFieldReference.current!.value.length === 0 ||
            selectedDate === undefined ||
            selectedDate === null ||
            (selectedDate !== undefined && selectedDate.toString().trim() === '') ||
            (selectedDate !== undefined && selectedDate.toString().length === 0)) {
            setDisplayErrorUpsert(true);
            return;
        }

        const data = {
            title: titleFieldReference.current!.value,
            date: selectedDate,
            reminder: reminderReference.current!.checked
        } as ITaskReminder;

        const taskService = getTasksService();

        const result = form.id === null || form.id === undefined
            ? await taskService.add(data)
            : await taskService.update(form.id, data);

        if (result !== 0 && result !== null) {
            setDisplaySuccess(true);

            setLoading(true);

            const tasksList = await taskService.list();

            setTasks(tasksList);
            setLoading(false);
        } else {
            setDisplayError(true);
        }

        onResetForm();
        setSelectedDate(new Date());
        setDisplayAddPanel(false);
    };

    const onToggle = async (id: number): Promise<any> => {
        const tasksService = getTasksService();

        const currentTask = await tasksService.get(id) as ITaskReminder;
        const updatedTask = { ...currentTask, reminder: !currentTask.reminder };

        const data = await tasksService.update(id, updatedTask);

        setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task));
    };

    return (
        <>
            <Stack horizontal horizontalAlign='space-between'>
                <PrimaryButton text='Add Task' iconProps={addIcon} onClick={onDisplayPanelClick} />

                {
                    tasks.length > 0 &&
                    <div ref={helpButtonReference}>
                        <IconButton iconProps={questionIcon} onClick={() => { setDisplayHelp(true); }} />
                    </div>
                }
            </Stack>

            {displaySuccess &&
                <MessageBar className={styles.container} messageBarType={MessageBarType.success} isMultiline={false} onDismiss={() => { setDisplaySuccess(false); }}>
                    Changes have been successfully made.
                </MessageBar>
            }

            {displayError &&
                <MessageBar className={styles.container} messageBarType={MessageBarType.error} isMultiline={false} onDismiss={() => { setDisplayError(false); }}>
                    An error has occured.
                </MessageBar>
            }

            {
                tasks.length > 0 ? (
                    <Stack className={styles.container} tokens={{ childrenGap: 30 }}>
                        {
                            tasks.map((task) => (
                                <DocumentCard
                                    className={['', styles.max__width, styles.card].join(' ')}
                                    aria-label={task.title}
                                    type={DocumentCardType.compact}
                                    onDoubleClick={() => onToggle(task.id)}
                                    onClick={(e: React.SyntheticEvent<HTMLElement>) => { e.preventDefault(); }}
                                    onClickHref='#'
                                >
                                    {(!task.reminder
                                        ? <DocumentCardPreview className={styles.preview} {...defaultTaskIcon} />
                                        : <DocumentCardPreview className={styles.preview} {...reminderTaskIcon} />
                                    )}

                                    <DocumentCardDetails>
                                        <DocumentCardTitle title={task.title} />
                                        <DocumentCardActivity activity={`Date ${new Date(task.date.toString()).toDateString()}`} people={[
                                            { name: task.person.displayName, profileImageSrc: task.person.image, initials: task.person.initials }
                                        ]} />
                                    </DocumentCardDetails>
                                    <DocumentCardActions actions={
                                        [
                                            {
                                                iconProps: { iconName: 'Edit' },
                                                onClick: onActionClick.bind(this, 'edit', task.id),
                                                ariaLabel: 'Edit Task',
                                            },
                                            {
                                                iconProps: { iconName: 'Delete' },
                                                onClick: onActionClick.bind(this, 'delete', task.id),
                                                ariaLabel: 'Delete Task',
                                            }
                                        ]
                                    } />
                                </DocumentCard>
                            ))
                        }
                    </Stack>
                ) : (
                    <Stack className={styles.container} tokens={{ childrenGap: 30 }}>
                        {
                            loading === true &&
                            <Spinner size={SpinnerSize.large} />
                        }

                        {
                            loading === false &&
                            <div>No tasks have been added.</div>
                        }
                    </Stack>
                )
            }

            <Panel isOpen={displayAddPanel} headerText={panelHeaderText} onDismiss={onHidePanelClick} closeButtonAriaLabel='Close'>
                <Stack tokens={{ childrenGap: 15 }}>
                    <TextField componentRef={titleFieldReference} defaultValue={form.title} label='Title' required />

                    <DatePicker label='Date' value={selectedDate} onSelectDate={setSelectedDate as (date: Date | null | undefined) => void} allowTextInput isRequired />

                    <Checkbox componentRef={reminderReference} label='Set Reminder?' defaultChecked={form.reminder} />

                    {displayErrorUpsert && (
                        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
                            Title and Date are both required.
                        </MessageBar>
                    )}

                    <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign='end'>
                        <PrimaryButton text={form.id === null || form.id === undefined ? 'Add' : 'Update'} onClick={onSubmitForm} />
                        <DefaultButton text='Cancel' onClick={onHidePanelClick} />
                    </Stack>
                </Stack>
            </Panel>

            <Dialog
                hidden={!displayDeleteTask}
                onDismiss={onHideDeleteDialogClick}
                dialogContentProps={deleteDialogContentProps}
                modalProps={{ isBlocking: true }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={onDeleteClick} text='Delete' />
                    <DefaultButton onClick={onHideDeleteDialogClick} text='Cancel' />
                </DialogFooter>
            </Dialog>

            {
                displayHelp &&
                <Coachmark target={helpButtonReference.current} positioningContainerProps={{ directionalHint: DirectionalHint.leftCenter, doNotLayer: false }}>
                    <TeachingBubbleContent
                        headline='Quick Tip'
                        hasCloseButton
                        closeButtonAriaLabel='Close'
                        secondaryButtonProps={{ text: 'Close', onClick: () => { setDisplayHelp(false); } }}
                        onDismiss={() => { setDisplayHelp(false); }}
                    >
                        Double clicking on a task card toggles the reminder status.
                    </TeachingBubbleContent>
                </Coachmark>
            }
        </>
    );
};

export default TasksAndReminders;