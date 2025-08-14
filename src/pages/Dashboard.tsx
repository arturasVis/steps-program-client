import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: activeBuilds = [], isLoading: activeBuildsLoading } = useQuery({
    queryKey: ['activeBuilds'],
    queryFn: apiService.getActiveBuilds,
  });

  const { data: builds, isLoading: buildsLoading, error: buildsError } = useQuery({
    queryKey: ['builds'],
    queryFn: apiService.getBuilds,
  });

  // Ensure builds is always an array and add debugging
  const buildsArray = Array.isArray(builds) ? builds : [];
  console.log('Builds data:', builds);
  console.log('Builds error:', buildsError);
  console.log('Builds array:', buildsArray);

  const { data: workflowTemplates, isLoading: templatesLoading, error: templatesError } = useQuery({
    queryKey: ['workflowTemplates'],
    queryFn: apiService.getWorkflowTemplates,
  });

  const { data: masterSteps, isLoading: stepsLoading, error: stepsError } = useQuery({
    queryKey: ['masterSteps'],
    queryFn: apiService.getMasterSteps,
  });

  // Ensure all data is always an array
  const workflowTemplatesArray = Array.isArray(workflowTemplates) ? workflowTemplates : [];
  const masterStepsArray = Array.isArray(masterSteps) ? masterSteps : [];

  const activeBuildsCount = activeBuilds.length;
  const totalBuildsCount = buildsArray.length;
  const completedBuildsCount = buildsArray.filter(build => build.status === 2).length;
  const completionRate = totalBuildsCount > 0 ? (completedBuildsCount / totalBuildsCount) * 100 : 0;

  const quickActions = [
    {
      title: 'Start New Build',
      description: 'Create and start a new PC build',
      icon: <PlayArrowIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      action: () => navigate('/builds'),
    },
    {
      title: 'Create Workflow',
      description: 'Design a new manufacturing process',
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      action: () => navigate('/workflow-templates'),
    },
    {
      title: 'Add Master Step',
      description: 'Create a new manufacturing step',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      action: () => navigate('/master-steps'),
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      action: () => navigate('/analytics'),
    },
  ];

  const statsCards = [
    {
      title: 'Active Builds',
      value: activeBuildsCount,
      subtitle: 'Currently in progress',
      color: '#2196f3',
      loading: activeBuildsLoading,
    },
    {
      title: 'Total Builds',
      value: totalBuildsCount,
      subtitle: 'All time builds',
      color: '#4caf50',
      loading: buildsLoading,
    },
               {
             title: 'Workflow Templates',
             value: workflowTemplatesArray.length,
             subtitle: 'Available processes',
             color: '#ff9800',
             loading: templatesLoading,
           },
           {
             title: 'Master Steps',
             value: masterStepsArray.length,
             subtitle: 'Defined steps',
             color: '#9c27b0',
             loading: stepsLoading,
           },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        PC Building Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor your manufacturing line performance and manage PC builds
      </Typography>

      {/* Stats Cards */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
         {statsCards.map((card, index) => (
           <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '250px' }} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    {card.loading ? (
                      <LinearProgress sx={{ width: '100%', height: '100%' }} />
                    ) : (
                      <Typography variant="h4" fontWeight="bold">
                        {card.value}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Completion Rate */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Build Completion Rate
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {completionRate.toFixed(1)}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {completedBuildsCount} of {totalBuildsCount} builds completed
          </Typography>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
         {quickActions.map((action, index) => (
           <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '250px' }} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={action.action}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                  sx={{
                    color: action.color,
                    mb: 2,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Recent Active Builds */}
      {activeBuildsCount > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Active Builds
          </Typography>
          <Paper sx={{ p: 2 }}>
            {activeBuilds.slice(0, 5).map((build) => (
              <Box
                key={build.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Build #{build.buildId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Started: {new Date(build.startedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={build.status === 0 ? 'In Progress' : 'Completed'}
                    color={build.status === 0 ? 'warning' : 'success'}
                    size="small"
                  />
                  {build.assignedAgent && (
                    <Chip label={build.assignedAgent} size="small" variant="outlined" />
                  )}
                </Box>
              </Box>
            ))}
            {activeBuildsCount > 5 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/active-builds')}
                  startIcon={<AddIcon />}
                >
                  View All ({activeBuildsCount})
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
}
