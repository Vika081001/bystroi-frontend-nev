export type ListResponse<T> = {
    result: T;
    count: number;
    page: number;
    size: number;
}