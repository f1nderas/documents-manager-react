export interface IDocumentFormData {
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

export interface IDocumentData extends IDocumentFormData {
  id: string;
}

export interface IDocumentsResponse {
  data: IDocumentData[];
}

export interface IDocumentResponse {
  data: IDocumentData;
}

export interface IDocumentOperationResponse {
  error_code: number;
  data?: IDocumentData;
}

export interface IDocumentState {
  documents: IDocumentData[];
  loading: boolean;
  error: string | null;
}
