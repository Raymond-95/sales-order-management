export interface CreatedDateRange {
  from: string
  to: string
}

export interface Filteration {
  createdDateRange: CreatedDateRange
  customerName: string
  status: string[]
  category: string[]
  country: string
}
