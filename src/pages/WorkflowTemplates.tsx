import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService, { 
  WorkflowTemplate, 
  MasterStep, 
  Category, 
  WorkflowPart, 
  WorkflowStepAssignment,
  CreateWorkflowPartRequest,
  CreateWorkflowStepAssignmentRequest
} from '../services/api';

interface CreateWorkflowTemplateRequest {
  name: string;
  description?: string;
  numberOfParts: number;
  isActive: boolean;
  version: number;
}

export default function WorkflowTemplates() {
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [openPartDialog, setOpenPartDialog] = useState(false);
  const [openStepAssignmentDialog, setOpenStepAssignmentDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);
  const [editingPart, setEditingPart] = useState<WorkflowPart | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  
  const [templateFormData, setTemplateFormData] = useState<CreateWorkflowTemplateRequest>({
    name: '',
    description: '',
    numberOfParts: 1,
    isActive: true,
    version: 1,
  });

  const [partFormData, setPartFormData] = useState<CreateWorkflowPartRequest>({
    workflowTemplateId: 0,
    partNumber: 1,
    name: '',
    description: '',
  });

  const [stepAssignmentFormData, setStepAssignmentFormData] = useState<CreateWorkflowStepAssignmentRequest>({
    workflowPartId: 0,
    masterStepId: 0,
    order: 1,
    isRequired: true,
  });

  const queryClient = useQueryClient();

  const { data: workflowTemplates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['workflowTemplates'],
    queryFn: apiService.getWorkflowTemplates,
  });

  const { data: masterSteps = [], isLoading: stepsLoading } = useQuery({
    queryKey: ['masterSteps'],
    queryFn: apiService.getMasterSteps,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: apiService.getCategories,
  });

  // Workflow parts are already included in the workflow template data
  // No need to fetch them separately
  
  // Create partsByTemplate from the workflow template data
  const partsByTemplate = workflowTemplates.reduce((acc, template) => {
    acc[template.id] = template.workflowParts || [];
    return acc;
  }, {} as Record<number, WorkflowPart[]>);

  const createTemplateMutation = useMutation({
    mutationFn: apiService.createWorkflowTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowTemplates'] });
      handleCloseTemplateDialog();
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<WorkflowTemplate> }) =>
      apiService.updateWorkflowTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowTemplates'] });
      handleCloseTemplateDialog();
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: apiService.deleteWorkflowTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowTemplates'] });
    },
  });

  const createPartMutation = useMutation({
    mutationFn: apiService.createWorkflowPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowTemplates'] });
      handleClosePartDialog();
    },
  });

  const updatePartMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<WorkflowPart> }) =>
      apiService.updateWorkflowPart(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowTemplates'] });
      handleClosePartDialog();
    },
  });

  const deletePartMutation = useMutation({
    mutationFn: apiService.deleteWorkflowPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowTemplates'] });
    },
  });

  const createStepAssignmentMutation = useMutation({
    mutationFn: apiService.createWorkflowStepAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowTemplates'] });
      handleCloseStepAssignmentDialog();
    },
  });

  const deleteStepAssignmentMutation = useMutation({
    mutationFn: apiService.deleteWorkflowStepAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowTemplates'] });
    },
  });

  const handleOpenTemplateDialog = (template?: WorkflowTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateFormData({
        name: template.name,
        description: template.description || '',
        numberOfParts: template.numberOfParts,
        isActive: template.isActive,
        version: template.version,
      });
    } else {
      setEditingTemplate(null);
      setTemplateFormData({
        name: '',
        description: '',
        numberOfParts: 1,
        isActive: true,
        version: 1,
      });
    }
    setOpenTemplateDialog(true);
  };

  const handleCloseTemplateDialog = () => {
    setOpenTemplateDialog(false);
    setEditingTemplate(null);
    setTemplateFormData({
      name: '',
      description: '',
      numberOfParts: 1,
      isActive: true,
      version: 1,
    });
  };

  const handleOpenPartDialog = (part?: WorkflowPart, templateId?: number) => {
    if (part) {
      setEditingPart(part);
      setPartFormData({
        workflowTemplateId: part.workflowTemplateId || 0,
        partNumber: part.partNumber,
        name: part.name,
        description: part.description || '',
      });
    } else {
      setEditingPart(null);
      setPartFormData({
        workflowTemplateId: templateId || 0,
        partNumber: 1,
        name: '',
        description: '',
      });
    }
    setOpenPartDialog(true);
  };

  const handleClosePartDialog = () => {
    setOpenPartDialog(false);
    setEditingPart(null);
    setPartFormData({
      workflowTemplateId: 0,
      partNumber: 1,
      name: '',
      description: '',
    });
  };

  const handleOpenStepAssignmentDialog = (partId: number) => {
    setSelectedPartId(partId);
    setStepAssignmentFormData({
      workflowPartId: partId,
      masterStepId: 0,
      order: 1,
      isRequired: true,
    });
    setOpenStepAssignmentDialog(true);
  };

  const handleCloseStepAssignmentDialog = () => {
    setOpenStepAssignmentDialog(false);
    setSelectedPartId(null);
    setStepAssignmentFormData({
      workflowPartId: 0,
      masterStepId: 0,
      order: 1,
      isRequired: true,
    });
  };

  const handleSubmitTemplate = () => {
    if (editingTemplate) {
      updateTemplateMutation.mutate({
        id: editingTemplate.id,
        data: templateFormData,
      });
    } else {
      createTemplateMutation.mutate(templateFormData);
    }
  };

  const handleDeleteTemplate = (id: number) => {
    if (window.confirm('Are you sure you want to delete this workflow template?')) {
      deleteTemplateMutation.mutate(id);
    }
  };

  const handleSubmitPart = () => {
    if (editingPart) {
      updatePartMutation.mutate({
        id: editingPart.id,
        data: {
          name: partFormData.name,
          description: partFormData.description,
          partNumber: partFormData.partNumber,
        },
      });
    } else {
      createPartMutation.mutate(partFormData);
    }
  };

  const handleSubmitStepAssignment = () => {
    createStepAssignmentMutation.mutate(stepAssignmentFormData);
  };

  const handleDeletePart = (partId: number) => {
    if (window.confirm('Are you sure you want to delete this workflow part?')) {
      deletePartMutation.mutate(partId);
    }
  };

  const handleDeleteStepAssignment = (assignmentId: number) => {
    if (window.confirm('Are you sure you want to remove this step assignment?')) {
      deleteStepAssignmentMutation.mutate(assignmentId);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Workflow Templates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage manufacturing process templates
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenTemplateDialog()}
        >
          Create Template
        </Button>
      </Box>

      {workflowTemplates.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Workflow Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first workflow template to organize your manufacturing processes.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenTemplateDialog()}
          >
            Create First Template
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {workflowTemplates.map((template) => (
            <Box key={template.id}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {template.description || 'No description'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={`${template.numberOfParts} part${template.numberOfParts !== 1 ? 's' : ''}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={`v${template.version}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      <Chip
                        label={template.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={template.isActive ? 'success' : 'default'}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Template">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenTemplateDialog(template)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Template">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTemplate(template.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Workflow Parts
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenPartDialog(undefined, template.id)}
                  >
                    Add Part
                  </Button>
                </Box>

                {!partsByTemplate[template.id] || partsByTemplate[template.id].length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No workflow parts yet. Add your first part to get started!
                  </Typography>
                ) : (
                  partsByTemplate[template.id].map((part) => (
                    <Accordion key={part.id} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Part {part.partNumber}: {part.name}
                          </Typography>
                          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit Part">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenPartDialog(part);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Part">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePart(part.id);
                                }}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {part.description || 'No description'}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Step Assignments
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenStepAssignmentDialog(part.id)}
                          >
                            Add Step
                          </Button>
                        </Box>

                        <List dense>
                          {part.stepAssignments
                            .sort((a, b) => a.order - b.order)
                            .map((assignment) => (
                              <ListItem key={assignment.id} sx={{ pl: 0 }}>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip
                                        label={`${assignment.order}`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                      <Typography variant="body2" fontWeight="bold">
                                        {assignment.masterStep.name}
                                      </Typography>
                                      {!assignment.isRequired && (
                                        <Chip label="Optional" size="small" color="warning" variant="outlined" />
                                      )}
                                    </Box>
                                  }
                                  secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        {assignment.masterStep.description}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        • {assignment.masterStep.estimatedTimeMinutes} min
                                      </Typography>
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <Tooltip title="Remove Step">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteStepAssignment(assignment.id)}
                                      color="error"
                                    >
                                      <RemoveCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))
                )}
              </Paper>
            </Box>
          ))}
        </Box>
      )}

      {/* Template Dialog */}
      <Dialog open={openTemplateDialog} onClose={handleCloseTemplateDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTemplate ? 'Edit Workflow Template' : 'Create New Workflow Template'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Template Name"
                value={templateFormData.name}
                onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                required
                placeholder="e.g., PC Assembly Workflow"
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Description"
                value={templateFormData.description}
                onChange={(e) => setTemplateFormData({ ...templateFormData, description: e.target.value })}
                multiline
                rows={3}
                placeholder="Describe the manufacturing process..."
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Number of Parts"
                type="number"
                value={templateFormData.numberOfParts}
                onChange={(e) => setTemplateFormData({ ...templateFormData, numberOfParts: Number(e.target.value) })}
                required
                inputProps={{ min: 1, max: 10 }}
                helperText="How many parts in this workflow?"
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Version"
                type="number"
                value={templateFormData.version}
                onChange={(e) => setTemplateFormData({ ...templateFormData, version: Number(e.target.value) })}
                required
                inputProps={{ min: 1 }}
                helperText="Template version number"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTemplateDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitTemplate}
            variant="contained"
            disabled={!templateFormData.name || templateFormData.numberOfParts <= 0}
          >
            {editingTemplate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Part Dialog */}
      <Dialog open={openPartDialog} onClose={handleClosePartDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPart ? 'Edit Workflow Part' : 'Add New Workflow Part'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Part Number"
                type="number"
                value={partFormData.partNumber}
                onChange={(e) => setPartFormData({ ...partFormData, partNumber: Number(e.target.value) })}
                required
                inputProps={{ min: 1 }}
                helperText="Execution order of this part"
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Part Name"
                value={partFormData.name}
                onChange={(e) => setPartFormData({ ...partFormData, name: e.target.value })}
                required
                placeholder="e.g., Main Assembly"
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Description"
                value={partFormData.description}
                onChange={(e) => setPartFormData({ ...partFormData, description: e.target.value })}
                multiline
                rows={2}
                placeholder="Describe what this part involves..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePartDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitPart}
            variant="contained"
            disabled={!partFormData.name || partFormData.partNumber <= 0}
          >
            {editingPart ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Step Assignment Dialog */}
      <Dialog open={openStepAssignmentDialog} onClose={handleCloseStepAssignmentDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add Step to Workflow Part</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
              <FormControl fullWidth required>
                <InputLabel>Master Step</InputLabel>
                <Select
                  value={stepAssignmentFormData.masterStepId}
                  onChange={(e) => setStepAssignmentFormData({ ...stepAssignmentFormData, masterStepId: Number(e.target.value) })}
                  label="Master Step"
                >
                  {masterSteps.map((step) => (
                    <MenuItem key={step.id} value={step.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: categories.find(c => c.id === step.categoryId)?.color || '#ccc',
                            borderRadius: '50%',
                          }}
                        />
                        {step.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
              <TextField
                fullWidth
                label="Execution Order"
                type="number"
                value={stepAssignmentFormData.order}
                onChange={(e) => setStepAssignmentFormData({ ...stepAssignmentFormData, order: Number(e.target.value) })}
                required
                inputProps={{ min: 1 }}
                helperText="Order of execution in this part"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStepAssignmentDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitStepAssignment}
            variant="contained"
            disabled={stepAssignmentFormData.masterStepId === 0 || stepAssignmentFormData.order <= 0}
          >
            Add Step
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
