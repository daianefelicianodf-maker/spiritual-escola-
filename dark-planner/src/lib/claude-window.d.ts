export {}

declare global {
  interface Window {
    claude?: {
      downloads?: {
        save(request: {
          filename: string
          data: string | Blob | ArrayBuffer | ArrayBufferView
        }): Promise<{ status: 'saved' }>
      }
    }
  }
}
