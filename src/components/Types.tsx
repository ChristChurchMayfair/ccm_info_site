export enum ServiceTime {
    Morning = "morning",
    Evening = "evening"
}

export type Series = {
    title: string
    seasonal?: boolean
}

export type Service = {
    id: string
    time: string
    biblePassages: string[]
    title: string
    series?: Series
    date: string
    note?: string
}

export type Term = {
    startDate: Date
    endDate: Date
}