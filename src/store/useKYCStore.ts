import { create } from 'zustand'

export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted' | 'none';

export interface KYCDocumentState {
    status: KYCStatus;
    rejection_reason?: string;
    last_updated?: string;
}

interface KYCState {
    tier: 1 | 2;
    documents: {
        id_front: KYCDocumentState;
        id_back: KYCDocumentState;
        selfie: KYCDocumentState;
        tax_document: KYCDocumentState;
    };
    idFrontFile: File | null;
    idBackFile: File | null;
    selfieFile: File | null;
    taxFile: File | null;
    isFetched: boolean;

    setTier: (tier: 1 | 2) => void;
    setIdFrontFile: (file: File | null) => void;
    setIdBackFile: (file: File | null) => void;
    setSelfieFile: (file: File | null) => void;
    setTaxFile: (file: File | null) => void;
    setKYCData: (data: any) => void;
    setDocumentStatus: (key: keyof KYCState['documents'], status: KYCStatus, reason?: string) => void;
    reset: () => void;
}

const initialDocuments = {
    id_front: { status: 'none' as KYCStatus },
    id_back: { status: 'none' as KYCStatus },
    selfie: { status: 'none' as KYCStatus },
    tax_document: { status: 'none' as KYCStatus },
};

export const useKYCStore = create<KYCState>((set) => ({
    tier: 1,
    documents: initialDocuments,
    idFrontFile: null,
    idBackFile: null,
    selfieFile: null,
    taxFile: null,
    isFetched: false,

    setTier: (tier) => set({ tier }),
    setIdFrontFile: (file) => set({ idFrontFile: file }),
    setIdBackFile: (file) => set({ idBackFile: file }),
    setSelfieFile: (file) => set({ selfieFile: file }),
    setTaxFile: (file) => set({ taxFile: file }),

    setKYCData: (data) => set({
        documents: {
            id_front: data.id_card?.front || initialDocuments.id_front,
            id_back: data.id_card?.back || initialDocuments.id_back,
            selfie: data.selfie || initialDocuments.selfie,
            tax_document: data.tax_document || initialDocuments.tax_document,
        },
        tier: data.tier || 1,
        isFetched: true
    }),

    setDocumentStatus: (key, status, reason) => set((state) => ({
        documents: {
            ...state.documents,
            [key]: {
                ...state.documents[key],
                status,
                rejection_reason: reason
            }
        }
    })),

    reset: () => set({
        tier: 1,
        documents: initialDocuments,
        idFrontFile: null,
        idBackFile: null,
        selfieFile: null,
        taxFile: null,
        isFetched: false,
    })
}));
