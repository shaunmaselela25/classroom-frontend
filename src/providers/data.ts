import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";
import { Subject } from "../types";

// Mock subjects data
export const mockSubjects: Subject[] = [
  {
    id: 1,
    code: "CS-301",
    name: "Data Structures and Algorithms",
    department: "Computer Science",
    description: "Advanced study of data structures including trees, graphs, and hash tables, along with algorithm design techniques such as divide-and-conquer, dynamic programming, and greedy algorithms.",
    createdAt: "2025-09-01T08:00:00Z"
  },
  {
    id: 2,
    code: "MATH-205",
    name: "Linear Algebra",
    department: "Mathematics",
    description: "Fundamental concepts of vector spaces, linear transformations, matrices, determinants, eigenvalues, and eigenvectors with applications to engineering and data science.",
    createdAt: "2025-09-01T08:00:00Z"
  },
  {
    id: 3,
    code: "PHYS-401",
    name: "Quantum Mechanics",
    department: "Physics",
    description: "Introduction to quantum theory covering wave functions, Schrödinger equation, quantum operators, and applications to atomic and molecular systems.",
    createdAt: "2025-09-01T08:00:00Z"
  }
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
                                                           resource
                                                         }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== 'subjects') {
      return { data: [] as TData[], total: 0 };
    }

    return { data: mockSubjects as unknown as TData[], total: mockSubjects.length };
  },

  getOne: async () => {
    throw new Error('This function is not present in mock');
  },

  getMany: async () => {
    throw new Error('This function is not present in mock');
  },

  create: async () => {
    throw new Error('This function is not present in mock');
  },

  update: async () => {
    throw new Error('This function is not present in mock');
  },

  deleteOne: async () => {
    throw new Error('This function is not present in mock');
  },

  getApiUrl: () => ''
};