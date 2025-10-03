// Hook for managing UI-only project data
// Stores fake "connected repos" until backend integration exists

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './use-local-storage';

const PROJECTS_KEY = 'projects';

export interface Project {
  id: string;
  name: string;
  owner: string;
  repo: string;
  description?: string;
  defaultBranch: string;
  isPrivate: boolean;
  connectedAt: string;
  lastValidatedAt?: string;
  status: 'active' | 'paused' | 'error';
  stats?: {
    totalCommits: number;
    validCommits: number;
    invalidCommits: number;
    lastCheckQuality: number; // percentage
  };
}

// Validator for project
function isValidProject(data: unknown): data is Project {
  if (typeof data !== 'object' || data === null) return false;

  const project = data as Record<string, unknown>;
  return (
    typeof project.id === 'string' &&
    typeof project.name === 'string' &&
    typeof project.owner === 'string' &&
    typeof project.repo === 'string' &&
    typeof project.defaultBranch === 'string' &&
    typeof project.isPrivate === 'boolean' &&
    typeof project.connectedAt === 'string' &&
    (project.status === 'active' || project.status === 'paused' || project.status === 'error')
  );
}

// Validator for project array
function isValidProjectArray(data: unknown): data is Project[] {
  return Array.isArray(data) && data.every(isValidProject);
}

/**
 * Hook for managing UI-only project data with localStorage persistence
 * Automatically namespaced by user ID
 * 
 * Projects are fake integration objects that will be replaced with
 * real GitHub App data when backend is implemented
 */
export function useProjects() {
  const { user } = useAuth();

  const [projects, setProjects, clearProjects, isLoading] = useLocalStorage<Project[]>(
    PROJECTS_KEY,
    {
      uid: user?.uid ?? null,
      defaultValue: [],
      validate: isValidProjectArray,
    }
  );

  const addProject = useCallback(
    (project: Omit<Project, 'id' | 'connectedAt' | 'status'>) => {
      const newProject: Project = {
        ...project,
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        connectedAt: new Date().toISOString(),
        status: 'active',
      };

      const currentProjects = projects ?? [];
      setProjects([...currentProjects, newProject]);

      return newProject;
    },
    [projects, setProjects]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Omit<Project, 'id' | 'connectedAt'>>) => {
      const currentProjects = projects ?? [];
      const updated = currentProjects.map((project) =>
        project.id === id
          ? {
              ...project,
              ...updates,
              lastValidatedAt: new Date().toISOString(),
            }
          : project
      );
      setProjects(updated);

      return updated.find((p) => p.id === id) ?? null;
    },
    [projects, setProjects]
  );

  const deleteProject = useCallback(
    (id: string) => {
      const currentProjects = projects ?? [];
      const filtered = currentProjects.filter((project) => project.id !== id);
      setProjects(filtered);
    },
    [projects, setProjects]
  );

  const getProjectById = useCallback(
    (id: string) => {
      const currentProjects = projects ?? [];
      return currentProjects.find((project) => project.id === id) ?? null;
    },
    [projects]
  );

  const pauseProject = useCallback(
    (id: string) => {
      updateProject(id, { status: 'paused' });
    },
    [updateProject]
  );

  const resumeProject = useCallback(
    (id: string) => {
      updateProject(id, { status: 'active' });
    },
    [updateProject]
  );

  const updateProjectStats = useCallback(
    (id: string, stats: Project['stats']) => {
      updateProject(id, { stats });
    },
    [updateProject]
  );

  const getProjectStats = useCallback(() => {
    const currentProjects = projects ?? [];
    const totalProjects = currentProjects.length;
    const activeProjects = currentProjects.filter((p) => p.status === 'active').length;
    const pausedProjects = currentProjects.filter((p) => p.status === 'paused').length;
    const errorProjects = currentProjects.filter((p) => p.status === 'error').length;

    const totalCommits = currentProjects.reduce((sum, p) => sum + (p.stats?.totalCommits ?? 0), 0);
    const validCommits = currentProjects.reduce((sum, p) => sum + (p.stats?.validCommits ?? 0), 0);
    const invalidCommits = currentProjects.reduce(
      (sum, p) => sum + (p.stats?.invalidCommits ?? 0),
      0
    );

    const avgQuality =
      currentProjects.reduce((sum, p) => sum + (p.stats?.lastCheckQuality ?? 0), 0) /
        totalProjects || 0;

    return {
      totalProjects,
      activeProjects,
      pausedProjects,
      errorProjects,
      totalCommits,
      validCommits,
      invalidCommits,
      avgQuality: Math.round(avgQuality * 100) / 100,
    };
  }, [projects]);

  return {
    projects: projects ?? [],
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    pauseProject,
    resumeProject,
    updateProjectStats,
    getProjectStats,
    clearProjects,
  };
}

/**
 * Create a mock project for testing/demo purposes
 */
export function createMockProject(overrides?: Partial<Project>): Omit<Project, 'id' | 'connectedAt' | 'status'> {
  return {
    name: overrides?.name ?? 'Example Repository',
    owner: overrides?.owner ?? 'username',
    repo: overrides?.repo ?? 'example-repo',
    description: overrides?.description ?? 'A sample repository for demonstration',
    defaultBranch: overrides?.defaultBranch ?? 'main',
    isPrivate: overrides?.isPrivate ?? false,
    stats: overrides?.stats ?? {
      totalCommits: 150,
      validCommits: 135,
      invalidCommits: 15,
      lastCheckQuality: 90,
    },
  };
}

