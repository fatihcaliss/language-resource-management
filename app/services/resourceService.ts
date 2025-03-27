import { apiClient } from "./instance"

// Types
export interface ExportResourceParams {
  environmentId: string
  applicationTypeId: string
}

export interface ImportResourceParams {
  formData: FormData
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
  postImportResource: async (params: ImportResourceParams): Promise<void> => {
    await apiClient.post("/Resources/create-bulk", params.formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
}
