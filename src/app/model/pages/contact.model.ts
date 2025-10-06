export namespace ContactModel {
    export interface Submit {
        full_name: string;
        email: string;
        phone_number: string;
        subject: string;
        content: string;
        ip_address: string;
        city: string;
        region: string;
        country: string;
        longitude: string;
        latitude: string;
        created_at: string;
    }
}