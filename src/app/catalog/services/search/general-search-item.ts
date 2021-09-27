export interface GeneralSearchItem {
  type: string,
  id: string,
  name: string,
  permissionLevel: {
    code: string,
    description: string
  },
  lastUpdatedAt: string,
  status: {
    code: string,
    description: string
  }
}
