import axios from 'axios';

const API_BASE_URL = 'http://localhost:5241/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data, error.config?.url);
    return Promise.reject(error);
  }
);

// Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  masterStepsCount?: number;
}

export interface WorkflowTemplate {
  id: number;
  name: string;
  description?: string;
  numberOfParts: number;
  createdDate: string;
  isActive: boolean;
  version: number;
  workflowParts: WorkflowPart[];
}

export interface WorkflowPart {
  id: number;
  workflowTemplateId: number;
  partNumber: number;
  name: string;
  description?: string;
  stepAssignments: WorkflowStepAssignment[];
}

export interface WorkflowStepAssignment {
  id: number;
  workflowPartId: number;
  order: number;
  isRequired: boolean;
  masterStep: MasterStep;
}

export interface CreateWorkflowPartRequest {
  workflowTemplateId: number;
  partNumber: number;
  name: string;
  description?: string;
}

export interface CreateWorkflowStepAssignmentRequest {
  workflowPartId: number;
  masterStepId: number;
  order: number;
  isRequired: boolean;
}

export interface MasterStep {
  id: number;
  name: string;
  description?: string;
  estimatedTimeMinutes: number;
  categoryId: number;
  isRequired: boolean;
}

export interface SKU {
  id: number;
  skU: string;
  cASE?: string;
  mOBO?: string;
  cPU?: string;
  rAM?: string;
  gPU?: string;
  hDD?: string;
  sSD?: string;
  windows: string;
}

export interface Build {
  id: number;
  orderId: string;
  skU: string;
  quantity: number;
  status: number;
  createdDate: string;
  completedDate?: string;
}

export interface ActiveBuild {
  id: number;
  buildId: number;
  status: number;
  startedAt: string;
  completedAt?: string;
  assignedAgent?: string;
  notes?: string;
}

export interface BuildStepExecution {
  id: number;
  masterStepId: number;
  activeBuildId: number;
  builderAssignmentId?: number;
  startedAt: string;
  completedAt?: string;
  completedBy: string;
  notes?: string;
  status: number;
}

export interface Agent {
  id: number;
  name: string;
  email?: string;
  isActive: boolean;
}

export interface BuilderAssignment {
  id: number;
  builderId: number;
  activeBuildId: number;
  assignedDate: string;
  status: number;
}

export interface Staff {
  staffNumber: number;
  name: string;
  testingPower?: number;
}

export interface StaffLoginRequest {
  staffNumber: number;
}

export interface StaffLoginResponse {
  success: boolean;
  message?: string;
  staff?: Staff;
  token?: string;
}

// API functions
export const apiService = {
  // Categories
  getCategories: async () => {
    try {
      console.log('API: Calling getCategories...');
      const response = await api.get<Category[]>('/categories');
      console.log('API: getCategories response:', response);
      console.log('API: getCategories data type:', typeof response.data);
      console.log('API: getCategories is array:', Array.isArray(response.data));
      console.log('API: getCategories data:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: getCategories error:', error);
      throw error;
    }
  },
  createCategory: async (category: Omit<Category, 'id'>) => {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  },
  updateCategory: async (id: number, category: Partial<Category>) => {
    const response = await api.put<Category>(`/categories/${id}`, category);
    return response.data;
  },
  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Workflow Templates
  getWorkflowTemplates: async () => {
    const response = await api.get<WorkflowTemplate[]>('/workflowtemplates');
    return response.data;
  },
  createWorkflowTemplate: async (template: Omit<WorkflowTemplate, 'id' | 'createdDate' | 'workflowParts'>) => {
    const response = await api.post<WorkflowTemplate>('/workflowtemplates', template);
    return response.data;
  },
  updateWorkflowTemplate: async (id: number, template: Partial<Omit<WorkflowTemplate, 'workflowParts'>>) => {
    const response = await api.put<WorkflowTemplate>(`/workflowtemplates/${id}`, template);
    return response.data;
  },
  deleteWorkflowTemplate: async (id: number) => {
    const response = await api.delete(`/workflowtemplates/${id}`);
    return response.data;
  },

  // Workflow Parts
  getWorkflowParts: async (templateId: number) => {
    const response = await api.get<WorkflowPart[]>(`/workflowtemplates/${templateId}/parts`);
    return response.data;
  },
  createWorkflowPart: async (part: CreateWorkflowPartRequest) => {
    const response = await api.post<WorkflowPart>('/workflowparts', part);
    return response.data;
  },
  updateWorkflowPart: async (id: number, part: Partial<WorkflowPart>) => {
    const response = await api.put<WorkflowPart>(`/workflowparts/${id}`, part);
    return response.data;
  },
  deleteWorkflowPart: async (id: number) => {
    const response = await api.delete(`/workflowparts/${id}`);
    return response.data;
  },

  // Workflow Step Assignments
  getWorkflowStepAssignments: async (partId: number) => {
    const response = await api.get<WorkflowStepAssignment[]>(`/workflowparts/${partId}/assignments`);
    return response.data;
  },
  createWorkflowStepAssignment: async (assignment: CreateWorkflowStepAssignmentRequest) => {
    const response = await api.post<WorkflowStepAssignment>('/workflowstepassignments', assignment);
    return response.data;
  },
  updateWorkflowStepAssignment: async (id: number, assignment: Partial<WorkflowStepAssignment>) => {
    const response = await api.put<WorkflowStepAssignment>(`/workflowstepassignments/${id}`, assignment);
    return response.data;
  },
  deleteWorkflowStepAssignment: async (id: number) => {
    const response = await api.delete(`/workflowstepassignments/${id}`);
    return response.data;
  },

  // Master Steps
  getMasterSteps: async () => {
    try {
      console.log('API: Calling getMasterSteps...');
      const response = await api.get<MasterStep[]>('/mastersteps');
      console.log('API: getMasterSteps response:', response);
      console.log('API: getMasterSteps data type:', typeof response.data);
      console.log('API: getMasterSteps is array:', Array.isArray(response.data));
      return response.data;
    } catch (error) {
      console.error('API: getMasterSteps error:', error);
      throw error;
    }
  },
  createMasterStep: async (step: Omit<MasterStep, 'id'>) => {
    const response = await api.post<MasterStep>('/mastersteps', step);
    return response.data;
  },
  updateMasterStep: async (id: number, step: Partial<MasterStep>) => {
    const response = await api.put<MasterStep>(`/mastersteps/${id}`, step);
    return response.data;
  },
  deleteMasterStep: async (id: number) => {
    const response = await api.delete(`/mastersteps/${id}`);
    return response.data;
  },

  // SKUs
  getSKUs: async () => {
    const response = await api.get<SKU[]>('/skus');
    return response.data;
  },
  createSKU: async (sku: Omit<SKU, 'id'>) => {
    const response = await api.post<SKU>('/skus', sku);
    return response.data;
  },
  updateSKU: async (id: number, sku: Partial<SKU>) => {
    const response = await api.put<SKU>(`/skus/${id}`, sku);
    return response.data;
  },
  deleteSKU: async (id: number) => {
    const response = await api.delete(`/skus/${id}`);
    return response.data;
  },

  // Builds
  getBuilds: async () => {
    const response = await api.get<Build[]>('/builds');
    return response.data;
  },
  createBuild: async (build: Omit<Build, 'id' | 'createdDate'>) => {
    const response = await api.post<Build>('/builds', build);
    return response.data;
  },
  updateBuild: async (id: number, build: Partial<Build>) => {
    const response = await api.put<Build>(`/builds/${id}`, build);
    return response.data;
  },
  deleteBuild: async (id: number) => {
    const response = await api.delete(`/builds/${id}`);
    return response.data;
  },

  // Active Builds
  getActiveBuilds: async () => {
    const response = await api.get<ActiveBuild[]>('/activebuilds');
    return response.data;
  },
  createActiveBuild: async (build: Omit<ActiveBuild, 'id' | 'startedAt'>) => {
    const response = await api.post<ActiveBuild>('/activebuilds', build);
    return response.data;
  },
  updateActiveBuild: async (id: number, build: Partial<ActiveBuild>) => {
    const response = await api.put<ActiveBuild>(`/activebuilds/${id}`, build);
    return response.data;
  },
  deleteActiveBuild: async (id: number) => {
    const response = await api.delete(`/activebuilds/${id}`);
    return response.data;
  },

  // Build Step Executions
  getBuildStepExecutions: async () => {
    const response = await api.get<BuildStepExecution[]>('/buildstepexecutions');
    return response.data;
  },
  createBuildStepExecution: async (execution: Omit<BuildStepExecution, 'id' | 'startedAt'>) => {
    const response = await api.post<BuildStepExecution>('/buildstepexecutions', execution);
    return response.data;
  },
  updateBuildStepExecution: async (id: number, execution: Partial<BuildStepExecution>) => {
    const response = await api.put<BuildStepExecution>(`/buildstepexecutions/${id}`, execution);
    return response.data;
  },
  deleteBuildStepExecution: async (id: number) => {
    const response = await api.delete(`/buildstepexecutions/${id}`);
    return response.data;
  },

  // Agents
  getAgents: async () => {
    const response = await api.get<Agent[]>('/agents');
    return response.data;
  },
  createAgent: async (agent: Omit<Agent, 'id'>) => {
    const response = await api.post<Agent>('/agents', agent);
    return response.data;
  },
  updateAgent: async (id: number, agent: Partial<Agent>) => {
    const response = await api.put<Agent>(`/agents/${id}`, agent);
    return response.data;
  },
  deleteAgent: async (id: number) => {
    const response = await api.delete(`/agents/${id}`);
    return response.data;
  },

  // Builder Assignments
  getBuilderAssignments: async () => {
    const response = await api.get<BuilderAssignment[]>('/builderassignments');
    return response.data;
  },
  createBuilderAssignment: async (assignment: Omit<BuilderAssignment, 'id' | 'assignedDate'>) => {
    const response = await api.post<BuilderAssignment>('/builderassignments', assignment);
    return response.data;
  },
  updateBuilderAssignment: async (id: number, assignment: Partial<BuilderAssignment>) => {
    const response = await api.put<BuilderAssignment>(`/builderassignments/${id}`, assignment);
    return response.data;
  },
  deleteBuilderAssignment: async (id: number) => {
    const response = await api.delete(`/builderassignments/${id}`);
    return response.data;
  },

  // Staff
  getStaff: async () => {
    const response = await api.get<Staff[]>('/staff');
    return response.data;
  },
  getStaffByStaffNumber: async (staffNumber: number) => {
    const response = await api.get<Staff>(`/staff/${staffNumber}`);
    return response.data;
  },
  getStaffProfile: async (staffNumber: number) => {
    const response = await api.get<Staff>(`/staff/profile?staffNumber=${staffNumber}`);
    return response.data;
  },
  loginStaff: async (request: StaffLoginRequest) => {
    const response = await api.post<StaffLoginResponse>('/staff/login', request);
    return response.data;
  },
};

export default apiService;
