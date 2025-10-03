// Hook for managing projects with uid namespacing
// Provides a reactive interface to localStorage-based projects

import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './use-local-storage';
import type { Project, ProjectCreateInput } from '@/lib/projects';
import {
  isValidProjectsArray,
  createProject as createProjectInStorage,
  updateProject as updateProjectInStorage,
  deleteProject as deleteProjectInStorage,
  initializeDemoProjects,
  getAggregateStats,
} from '@/lib/projects';

const PROJECTS_KEY = 'projects';

/**
 * Hook for managing projects with localStorage persistence
 * Automatically namespaced by user ID
 * 
 * Provides reactive state management for projects without useEffect spam
 */
export function useProjects() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [projects, setProjects, clearProjects, isLoading] = useLocalStorage<Project[]>(
    PROJECTS_KEY,
    {
      uid,
      defaultValue: [],
      validate: isValidProjectsArray,
    }
  );

  // Initialize demo projects if empty (only on first load)
  const currentProjects = useMemo(() => {
    if (!projects || projects.length === 0) {
      const demo = initializeDemoProjects(uid);
      return demo;
    }
    return projects;
  }, [projects, uid]);

  /**
   * Create a new project
   */
  const createProject = useCallback(
    (input: ProjectCreateInput) => {
      const newProject = createProjectInStorage(input, uid);
      const updated = [...currentProjects, newProject];
      setProjects(updated);
      return newProject;
    },
    [currentProjects, setProjects, uid]
  );

  /**
   * Update an existing project
   */
  const updateProject = useCallback(
    (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
      const updated = updateProjectInStorage(id, updates, uid);
      if (!updated) return null;

      // Update local state
      const newProjects = currentProjects.map((p) => (p.id === id ? updated : p));
      setProjects(newProjects);
      return updated;
    },
    [currentProjects, setProjects, uid]
  );

  /**
   * Delete a project
   */
  const deleteProject = useCallback(
    (id: string) => {
      const success = deleteProjectInStorage(id, uid);
      if (success) {
        const filtered = currentProjects.filter((p) => p.id !== id);
        setProjects(filtered);
      }
      return success;
    },
    [currentProjects, setProjects, uid]
  );

  /**
   * Get a single project by ID
   */
  const getProject = useCallback(
    (id: string): Project | null => {
      return currentProjects.find((p) => p.id === id) ?? null;
    },
    [currentProjects]
  );

  /**
   * Update project statistics based on a validation
   */
  const updateProjectStats = useCallback(
    (projectId: string, validationResult: { valid: boolean; message: string; timestamp: string; author?: string; hash?: string }) => {
      const project = getProject(projectId);
      if (!project) return null;

      const totalCommits = project.totalCommits + 1;
      const compliantCommits = project.compliantCommits + (validationResult.valid ? 1 : 0);
      const nonCompliantCommits = project.nonCompliantCommits + (validationResult.valid ? 0 : 1);

      // Determine status
      let status: Project['status'];
      if (validationResult.valid) {
        status = 'pass';
      } else {
        const nonCompliantPercentage = (nonCompliantCommits / totalCommits) * 100;
        status = nonCompliantPercentage > 30 ? 'fail' : 'warning';
      }

      return updateProject(projectId, {
        lastCommit: new Date(validationResult.timestamp).toLocaleString(),
        lastCommitMessage: validationResult.message,
        lastCommitHash: validationResult.hash ?? '',
        lastCommitAuthor: validationResult.author ?? '',
        lastCommitDate: validationResult.timestamp,
        status,
        totalCommits,
        compliantCommits,
        nonCompliantCommits,
      });
    },
    [getProject, updateProject]
  );

  /**
   * Get aggregate statistics across all projects
   */
  const aggregateStats = useMemo(() => {
    return getAggregateStats(uid);
  }, [currentProjects, uid]);

  /**
   * Reset projects to demo data
   */
  const resetToDemo = useCallback(() => {
    clearProjects();
    const demo = initializeDemoProjects(uid);
    setProjects(demo);
    return demo;
  }, [clearProjects, setProjects, uid]);

  return {
    projects: currentProjects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    updateProjectStats,
    aggregateStats,
    resetToDemo,
    clearProjects,
  };
}
