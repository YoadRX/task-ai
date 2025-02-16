export interface FileType {
  fieldname: string; // The name of the form field
  originalname: string; // The original name of the file
  encoding: string; // File encoding (e.g., '7bit')
  mimetype: string; // MIME type (e.g., 'audio/mpeg', 'image/png')
  buffer: Buffer; // File data as a Buffer
  size: number; // File size in bytes
}
