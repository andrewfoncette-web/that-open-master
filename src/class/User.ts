
export interface IUser {
    id: string;
    name: string;
    title: string;
    email: string;
    contactNumber: string;
}

export class User implements IUser {

    id: string;
    name: string;
    title: string;
    email: string;
    contactNumber: string;

    constructor(data: Partial<IUser> = {}) {

        this.id = data.id ?? "";
        this.name = data.name ?? "";
        this.title = data.title ?? "";
        this.email = data.email ?? "";
        this.contactNumber = data.contactNumber ?? "";

    }
}
