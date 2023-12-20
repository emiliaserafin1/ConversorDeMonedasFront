export interface Conversion {
    userId: number,
    sourceCurrencyId: number,
    targetCurrencyId: number,
    originalAmount: number
    sourceCurrencyName: string,
    targetCurrencyName: string
    convertedAmount: number
    date: Date
}

export interface ConversionResult{
    convertedAmount: number
}
