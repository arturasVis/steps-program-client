import React, { useState } from 'react';
import {
  Box,
  Grid,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService, { Category } from '../services/api';

export default function Categories() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1976d2',
  });

  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: apiService.getCategories,
  });

  // Ensure categories is always an array and add debugging
  const categoriesArray = Array.isArray(categories) ? categories : [];
  console.log('Categories data:', categories);
  console.log('Categories error:', error);
  console.log('Categories array:', categoriesArray);
  console.log('Is loading:', isLoading);
  console.log('Categories count:', categoriesArray.length);

  const createMutation = useMutation({
    mutationFn: apiService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      apiService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleOpenDialog = (category?: Category) => {
    console.log('handleOpenDialog called with:', category);
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#1976d2',
      });
    }
    console.log('Setting openDialog to true');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#1976d2',
    });
  };

  const handleSubmit = () => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData as Omit<Category, 'id'>);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Categories
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage step categories for organizing manufacturing processes
          </Typography>
        </Box>
                 <Box sx={{ display: 'flex', gap: 2 }}>
           <Button
             variant="outlined"
             onClick={() => {
               console.log('Testing API call manually...');
               apiService.getCategories().then(data => {
                 console.log('Manual API call result:', data);
               }).catch(err => {
                 console.error('Manual API call error:', err);
               });
             }}
           >
             Test API
           </Button>
           <Button
             variant="contained"
             startIcon={<AddIcon />}
             onClick={() => {
               console.log('Add Category button clicked');
               handleOpenDialog();
             }}
           >
             Add Category
           </Button>
         </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#ffebee' }}>
          <Typography color="error" variant="body1">
            Error loading categories: {error.message}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please check if the API is running and accessible.
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
                <TableCell>Color</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>Loading categories...</Typography>
                  </TableCell>
                </TableRow>
              ) : categoriesArray.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary">
                      No categories found. Create your first category to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categoriesArray.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CategoryIcon sx={{ mr: 1, color: category.color }} />
                      <Typography variant="body1" fontWeight="bold">
                        {category.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: category.color,
                        borderRadius: '50%',
                        border: '2px solid #fff',
                        boxShadow: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Category">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(category)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Category">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(category.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                                   </TableCell>
               </TableRow>
               ))
             )}
           </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              type="color"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name}
          >
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
