import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  IDocumentFormData,
  IDocumentState,
} from "@/interfaces/document.interface";
import { documentService } from "../service/service";

interface DocumentError {
  error?: string;
}

export const fetchDocuments = createAsyncThunk(
  "data/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await documentService.getAll();
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<DocumentError>;
      return rejectWithValue(
        axiosError.response?.data?.error || "Failed to fetch documents"
      );
    }
  }
);

export const createDocument = createAsyncThunk(
  "data/createDocument",
  async (data: IDocumentFormData, { rejectWithValue }) => {
    try {
      const response = await documentService.create(data);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<DocumentError>;
      return rejectWithValue(
        axiosError.response?.data?.error || "Failed to create document"
      );
    }
  }
);

export const updateDocument = createAsyncThunk(
  "data/updateDocument",
  async (
    { id, data }: { id: string; data: IDocumentFormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await documentService.update(id, data);
      if (!response.data.data) {
        throw new Error("No data in response");
      }
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<DocumentError>;
      return rejectWithValue(
        axiosError.response?.data?.error || "Failed to update document"
      );
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "data/deleteDocument",
  async (id: string, { rejectWithValue }) => {
    try {
      await documentService.delete(id);
      // return response.data.data;
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<DocumentError>;
      return rejectWithValue(
        axiosError.response?.data?.error || "Failed to delete document"
      );
    }
  }
);

const initialState: IDocumentState = {
  documents: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.push(action.payload);
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as string;
      })

      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const index = state.documents.findIndex((doc) => doc.id === payload.id);
        if (index !== -1) state.documents[index] = payload;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as string;
      })

      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload
        );
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as string;
      });
  },
});

export const { clearError } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
