/**
 * server response
*/
export interface ServerResponse {
    /**
     * api id
    */
    statusInfo: StatusInfo;
    /**
     * response param
    */
    responseData?: any;
}

export interface Response {
    status: number;
    body?: any;
    error?: string;
}

export interface StatusInfo {
    statusCode: number;
    statusMessage: string;
    errorMessage?: any;
}

export interface UserManagementResponse {
    responseData: any;
    errorMessage?: any;
}
