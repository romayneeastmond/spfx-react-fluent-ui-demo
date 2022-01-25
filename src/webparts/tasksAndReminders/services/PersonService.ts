import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp/presets/all';
import { IPerson } from './IPerson';

export default class PersonService {
    public getPerson = async (context: WebPartContext, id: number): Promise<IPerson> => {
        sp.setup({ spfxContext: context });

        return await sp.web.siteUserInfoList.items.getById(id).get()
            .then((response: any) => {
                return response;
            }).then((data: any) => {                
                return {
                    id: data.Id,
                    displayName: data.Title,
                    initials: this.getPersonInitials(data.Title),
                    image: data.Picture.Url
                } as IPerson;
            }).catch((error: any) => {
                console.log(error);

                return null;
            });
    }

    public getPersonInitials = (displayName: string): string => {
        const parts = displayName.split(/,|\s/);

        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`;
        }

        return displayName.substring(0, 2).toUpperCase();
    }
}