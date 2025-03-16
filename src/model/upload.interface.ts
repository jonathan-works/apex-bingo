import { EventoRequest } from "./evento.interface";

export interface UploadRequest {
    tipo: string;
    evento: EventoRequest | null;
    valor: number;
    fileName: string;
    base64: string;
    mimeType: string;
}

export interface UploadResponse {
    quantiade: string;
}
