export interface Conversion {
    userId: number,
    sourceCurrencyId: number,
    targetCurrencyId: number,
    originalAmount: number
}

export interface ConversionResult{
    convertedAmount: number
}
