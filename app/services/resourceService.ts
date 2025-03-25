import { apiClient } from "./instance"

// Types
export interface ExportResourceParams {
  environmentId: string
  applicationTypeId: string
}

// API functions
export const resourceService = {
  // Function to export resources as Excel file
  postExportResource: async (params: ExportResourceParams): Promise<Blob> => {
    const response = await apiClient.post("/Resources/excel-export", params, {
      responseType: "blob",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
    return response.data as Blob
  },
}
