# SharePoint Framework (SPFx) using React and Fluent UI React

This project shows the basic functionality of a 'to-do' application that has Create, Retrieve, Update, and Delete (CRUD) operations. It is organized into a single Web Part written within a single React functional component.

The graphical interface uses a number of Fluent UI React components (formerly Office UI Fabric React) such as Coachmark, Dialog, DocumentCard, IconButton, MessageBar, Panel, PrimaryButton, and Stack. These reuseable components' styling creates an experience that feels like out of the box SharePoint. Therefore allowing the development process to focus on functionality rather than on CSS styling.

Finally the backend is a SharePoint Custom List which is automatically deployed when the application is added into a site. The Web Part integrates with the list by using the pnp/sp fluent api to call SharePoint rest service endpoints.

## How to Configure

Run an npm install

```
npm i
```

This version of SPFx uses SharePoint Online for workbench testing. Therefore edit the _initialPage_ setting in the **\config\serve.json** file to use your own tenant:

```
https://YOUR_TENANT.sharepoint.com/sites/YOUR_SITE_NAME/_layouts/15/workbench.aspx
```

In conjunction with the online workbench there is a localhost instance that contains manifest information for the entire solution. Before this can be served at **localhost:4321/temp/manifests.js** install the development certificate by running the command

```
gulp trust-dev-cert
```

### Know Issues

The Yeomen generator scaffolds the project files into the necessary directories. However the localized resource files, do not seem to package into the lib folder after building with gulp. In some cases manually editing the _localizedResources_ settings in the **\config\config.json** file fixes this issue. For example, changing:

```
"TasksAndRemindersWebPartStrings": "lib/webparts/tasksAndReminders/loc/{locale}.js"
```

to:

```
"TasksAndRemindersWebPartStrings": "src/webparts/tasksAndReminders/loc/{locale}.js"
```

This could be a result of incompatibility issues with the SPFx or Gulp versions.

Build to confirm that there are no errors, by using the command

```
gulp build
```

For projects with multiple Web Parts the Yeoman generator rewrites the serve.json file settings to defaults. Therefore be mindful to readd your workbench endpoint.

The command to add [additional] Web Parts is

```
yo @microsoft/sharepoint
```

## How to Test

To test without deploying the Web Part create a Custom SharePoint list, within a site, with the structure found below.

| Column   | Type                      | Required |
| -------- | ------------------------- | -------- |
| Title    | Single line of text       | Yes      |
| Date     | Date and Time (Date Only) | Yes      |
| Reminder | Yes / No                  |          |

Edit the _listName_ variable in the **\src\webparts\tasksAndReminders\services\TaskReminderService.ts** file to match the name of your custom list. By default the Web Part expects a list called _Tasks and Reminders_ but this can be overridden during deployment by editing the _ListInstance_ settings in the **\sharepoint\assets\elements.xml** file.

After running the following command

```
gulp serve
```

The Web Part requires the context of the site with the custom list. Navigate to the workbench of that particular site. The format should be similar to:

```
https://YOUR_TENANT.sharepoint.com/sites/YOUR_SITE_NAME/_layouts/15/workbench.aspx
```

Then add the Web Part to the Workbench section for testing.

## Deploying to SharePoint Online

Before deploying to SharePoint, issue the two Gulp commands which will create an installable package

```
gulp build --ship
```

Then deploy the build folder after running the following command

```
gulp package-solution --ship
```

From within your SharePoint tenant's AppCatalog site, upload or drag the **\sharepoint\solution\tasks-and-reminders.sppkg** package as a new application within the **Apps for SharePoint** section.

Then add the app within any other SharePoint site. The deployment process will automatically create the custom list. Then the Web Part, _Tasks and Reminders_ can be added to any section.

## Environment

The following sections outline the packages used for this demonstration.

### Relevant Global Packages

| Package                         | Version  | Description                 |
| ------------------------------- | -------- | --------------------------- |
| Node.js                         | v14.18.3 | Node.js                     |
| npm                             | 6.14.15  | Node Package Manager        |
| @microsoft/generator-sharepoint | 1.13.1   | SharePoint Framework (SPFx) |
| gulp-cli                        | 2.3.0    | Gulp CLI                    |
| typescript                      | 4.4.3    | TypeScript                  |
| yo                              | 4.3.0    | Yeoman                      |

### Relevant npm Packages (package.json)

| Package                | Version | Description |
| ---------------------- | ------- | ----------- |
| @pnp/sp                | ^2.11.0 | Api         |
| office-ui-fabric-react | 7.174.1 | Fluent UI   |
| react                  | 16.13.1 | React       |
| react-dom              | 16.13.1 | React DOM   |

### Useful Commands

```
node --version && npm --version
```

```
npm list -g --depth=0
```

## Copyright and Ownership

All terms used are copyright to their original authors.
