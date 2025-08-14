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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService, { MasterStep, Category } from '../services/api';

export default function MasterSteps() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStep, setEditingStep] = useState<MasterStep | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimatedTimeMinutes: 5,
    categoryId: 0,
    isRequired: true,
  });

  const queryClient = useQueryClient();

  const { data: masterSteps = [], isLoading, error: masterStepsError } = useQuery({
    queryKey: ['masterSteps'],
    queryFn: apiService.getMasterSteps,
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: apiService.getCategories,
  });

  // Ensure both masterSteps and categories are always arrays and add debugging
  const masterStepsArray = Array.isArray(masterSteps) ? masterSteps : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];
  
  // Additional safety check for the specific JSON response format
  const safeMasterSteps = (() => {
    if (Array.isArray(masterSteps)) return masterSteps;
    if (masterSteps && typeof masterSteps === 'object' && masterSteps !== null) {
      const anyMasterSteps = masterSteps as any;
      if ('$values' in anyMasterSteps && Array.isArray(anyMasterSteps.$values)) {
        return anyMasterSteps.$values;
      }
    }
    return [];
  })();
  
  console.log('MasterSteps - MasterSteps data:', masterSteps);
  console.log('MasterSteps - MasterSteps error:', masterStepsError);
  console.log('MasterSteps - MasterSteps array:', masterStepsArray);
  console.log('MasterSteps - MasterSteps array type:', typeof masterStepsArray);
  console.log('MasterSteps - MasterSteps array length:', masterStepsArray.length);
  console.log('MasterSteps - Safe master steps:', safeMasterSteps);
  console.log('MasterSteps - Categories data:', categories);
  console.log('MasterSteps - Categories error:', categoriesError);
  console.log('MasterSteps - Categories array:', categoriesArray);

  const createMutation = useMutation({
    mutationFn: apiService.createMasterStep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterSteps'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MasterStep> }) =>
      apiService.updateMasterStep(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterSteps'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteMasterStep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterSteps'] });
    },
  });

  const handleOpenDialog = (step?: MasterStep) => {
    if (step) {
      setEditingStep(step);
      setFormData({
        name: step.name,
        description: step.description || '',
        estimatedTimeMinutes: step.estimatedTimeMinutes,
        categoryId: step.categoryId,
        isRequired: step.isRequired,
      });
    } else {
      setEditingStep(null);
      setFormData({
        name: '',
        description: '',
        estimatedTimeMinutes: 5,
        categoryId: 0,
        isRequired: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStep(null);
    setFormData({
      name: '',
      description: '',
              estimatedTimeMinutes: 5,
        categoryId: 0,
        isRequired: true,
    });
  };

  const handleSubmit = () => {
    if (editingStep) {
      updateMutation.mutate({ id: editingStep.id, data: formData });
    } else {
      createMutation.mutate(formData as Omit<MasterStep, 'id'>);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this Master Step? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categoriesArray.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getCategoryColor = (categoryId: number) => {
    const category = categoriesArray.find(cat => cat.id === categoryId);
    return category ? category.color : '#999';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Master Steps
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Define individual manufacturing steps with time estimates and categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Master Step
        </Button>
      </Box>

      {/* Error Display */}
      {categoriesError && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#ffebee' }}>
          <Typography color="error" variant="body1">
            Error loading categories: {categoriesError.message}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Master Steps require categories to be loaded. Please check if the API is accessible.
          </Typography>
        </Paper>
      )}

      {masterStepsError && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#ffebee' }}>
          <Typography color="error" variant="body1">
            Error loading master steps: {masterStepsError.message}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please check if the API is accessible and try refreshing the page.
          </Typography>
        </Paper>
      )}

      {/* Loading State */}
      {(isLoading || categoriesLoading) && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Loading...
          </Typography>
        </Paper>
      )}

      {/* No Data State */}
      {!isLoading && !masterStepsError && safeMasterSteps.length === 0 && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            No master steps found. Create your first master step to get started.
          </Typography>
        </Paper>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Estimated Time</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {safeMasterSteps.map((step: any) => (
                <TableRow key={step.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight="bold">
                        {step.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {step.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCategoryName(step.categoryId)}
                      size="small"
                      sx={{
                        backgroundColor: getCategoryColor(step.categoryId),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatTime(step.estimatedTimeMinutes)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={step.isRequired ? 'Required' : 'Optional'}
                      size="small"
                      color={step.isRequired ? 'error' : 'default'}
                      variant={step.isRequired ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Master Step">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(step)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Master Step">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(step.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingStep ? 'Edit Master Step' : 'Add New Master Step'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Step Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Install CPU"
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                placeholder="Describe what this step involves..."
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  label="Category"
                >
                                           {categoriesArray.map((category) => (
                           <MenuItem key={category.id} value={category.id}>
                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
                               <Box
                                 sx={{
                                   width: 16,
                                   height: 16,
                                   backgroundColor: category.color,
                                   borderRadius: '50%',
                                   mr: 1,
                                 }}
                               />
                               {category.name}
                             </Box>
                           </MenuItem>
                         ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Estimated Time (minutes)"
                type="number"
                value={formData.estimatedTimeMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedTimeMinutes: Number(e.target.value) })}
                required
                inputProps={{ min: 1, max: 480 }}
                helperText="Enter time in minutes (1-480)"
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                  />
                }
                label="This step is required for the workflow"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || formData.categoryId === 0 || formData.estimatedTimeMinutes <= 0}
          >
            {editingStep ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
