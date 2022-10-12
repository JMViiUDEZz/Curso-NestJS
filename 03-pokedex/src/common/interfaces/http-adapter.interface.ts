export interface HttpAdapter {
    //T indica que es un tipo genérico
    get<T>( url: string ): Promise<T>;
}