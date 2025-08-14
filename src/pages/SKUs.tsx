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
  Chip,
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
  Memory as MemoryIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService, { SKU } from '../services/api';

export default function SKUs() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSKU, setEditingSKU] = useState<SKU | null>(null);
  const [formData, setFormData] = useState({
    skU: '',
    cASE: '',
    mOBO: '',
    cPU: '',
    rAM: '',
    gPU: '',
    hDD: '',
    sSD: '',
    windows: '',
  });

  const queryClient = useQueryClient();

  const { data: skus = [], isLoading } = useQuery({
    queryKey: ['skus'],
    queryFn: apiService.getSKUs,
  });

  const createMutation = useMutation({
    mutationFn: apiService.createSKU,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skus'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SKU> }) =>
      apiService.updateSKU(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skus'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteSKU,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skus'] });
    },
  });

  const handleOpenDialog = (sku?: SKU) => {
    if (sku) {
      setEditingSKU(sku);
      setFormData({
        skU: sku.skU,
        cASE: sku.cASE || '',
        mOBO: sku.mOBO || '',
        cPU: sku.cPU || '',
        rAM: sku.rAM || '',
        gPU: sku.gPU || '',
        hDD: sku.hDD || '',
        sSD: sku.sSD || '',
        windows: sku.windows,
      });
    } else {
      setEditingSKU(null);
      setFormData({
        skU: '',
        cASE: '',
        mOBO: '',
        cPU: '',
        rAM: '',
        gPU: '',
        hDD: '',
        sSD: '',
        windows: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSKU(null);
    setFormData({
      skU: '',
      cASE: '',
      mOBO: '',
      cPU: '',
      rAM: '',
      gPU: '',
      hDD: '',
      sSD: '',
      windows: '',
    });
  };

  const handleSubmit = () => {
    if (editingSKU) {
      updateMutation.mutate({ id: editingSKU.id, data: formData });
    } else {
      createMutation.mutate(formData as Omit<SKU, 'id'>);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this SKU?')) {
      deleteMutation.mutate(id);
    }
  };

  const getComponentChip = (value: string | undefined, label: string) => {
    if (!value || value.trim() === '') return null;
    return (
      <Chip
        label={`${label}: ${value.trim()}`}
        size="small"
        variant="outlined"
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            SKU Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage PC configurations and component specifications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New SKU
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU Code</TableCell>
                <TableCell>Components</TableCell>
                <TableCell>Windows</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {skus.map((sku) => (
                <TableRow key={sku.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MemoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight="bold">
                        {sku.skU}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {getComponentChip(sku.cASE, 'Case')}
                      {getComponentChip(sku.mOBO, 'Motherboard')}
                      {getComponentChip(sku.cPU, 'CPU')}
                      {getComponentChip(sku.rAM, 'RAM')}
                      {getComponentChip(sku.gPU, 'GPU')}
                      {getComponentChip(sku.hDD, 'HDD')}
                      {getComponentChip(sku.sSD, 'SSD')}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={sku.windows} color="primary" size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit SKU">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(sku)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete SKU">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(sku.id)}
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
          {editingSKU ? 'Edit SKU' : 'Add New SKU'}
        </DialogTitle>
        <DialogContent>
                               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="SKU Code"
                value={formData.skU}
                onChange={(e) => setFormData({ ...formData, skU: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Windows Version"
                value={formData.windows}
                onChange={(e) => setFormData({ ...formData, windows: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Case"
                value={formData.cASE}
                onChange={(e) => setFormData({ ...formData, cASE: e.target.value })}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Motherboard"
                value={formData.mOBO}
                onChange={(e) => setFormData({ ...formData, mOBO: e.target.value })}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="CPU"
                value={formData.cPU}
                onChange={(e) => setFormData({ ...formData, cPU: e.target.value })}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="RAM"
                value={formData.rAM}
                onChange={(e) => setFormData({ ...formData, rAM: e.target.value })}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="GPU"
                value={formData.gPU}
                onChange={(e) => setFormData({ ...formData, gPU: e.target.value })}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="HDD"
                value={formData.hDD}
                onChange={(e) => setFormData({ ...formData, hDD: e.target.value })}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="SSD"
                value={formData.sSD}
                onChange={(e) => setFormData({ ...formData, sSD: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.skU || !formData.windows}
          >
            {editingSKU ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
