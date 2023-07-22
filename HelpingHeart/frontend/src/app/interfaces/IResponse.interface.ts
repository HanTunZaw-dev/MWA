export interface IResponse<T = unknown> {
    success: boolean,
    data: T
}