export namespace ServiceDetailModel {
    export interface IServiceDetail {
        id: string;
        title: string;
        description: string;
        icon: string;
        benefits: string[];
        workflow: IWorkflowStep[];
        deliverables: string[];
        timeline: string;
        price_start: string;
    }

    export interface IWorkflowStep {
        step: number;
        title: string;
        description: string;
        icon: string;
    }
}
