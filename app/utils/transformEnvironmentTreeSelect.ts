export interface Environment {
  id: string
  name: string
  applicationTypes: ApplicationType[]
}

export interface ApplicationType {
  id: string
  name: string
}

// Utility function to transform environment data for tree component
export const transformEnvironmentData = (data: Environment[]) => {
  if (!data) return []

  // Create a copy of the data array and sort it alphabetically by name
  const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name))

  return sortedData.map((env, envIndex) => ({
    title: env.name,
    key: `${envIndex}`,
    value: env.id,
    children: env.applicationTypes
      .sort((a, b) => a.name.localeCompare(b.name)) // Also sort children alphabetically
      .map((app, appIndex) => ({
        title: app.name,
        key: `${envIndex}-${appIndex}`,
        value: app.id,
      })),
  }))
}
