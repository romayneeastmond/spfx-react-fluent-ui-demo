import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import TasksAndReminders from './components/TasksAndReminders';
import { ITasksAndRemindersProps } from './components/ITasksAndRemindersProps';

export interface ITasksAndRemindersWebPartProps {
    
}

export default class TasksAndRemindersWebPart extends BaseClientSideWebPart<ITasksAndRemindersWebPartProps> {
    public render(): void {
        const element: React.ReactElement<ITasksAndRemindersProps> = React.createElement(
            TasksAndReminders,
            {
                context: this.context
            }
        );

        ReactDom.render(element, this.domElement);
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                
            ]
        };
    }
}
