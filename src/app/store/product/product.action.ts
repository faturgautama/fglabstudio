export namespace ProductAction {
    export class GetProduct {
        static readonly type = '[Product] Get All';
    }

    export class GetByIdProduct {
        static readonly type = '[Product] Get By Id';
        constructor(public id: string) { }
    }
}