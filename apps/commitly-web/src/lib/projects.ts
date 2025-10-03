// Project management utilities for localStorage-based fake integrations
// Until backend is implemented, this provides a functional UI experience

import { getStorageItem, setStorageItem } from './storage';

export type ProjectStatus = 'pass' | 'fail' | 'warning';

export interface Project {
  id: string;
  name: string;
  repository: string;
  description: string;
  lastCommit: string;
  lastCommitMessage: string;
  lastCommitHash: string;
  lastCommitAuthor: string;
  lastCommitDate: string;
  status: ProjectStatus;
  totalCommits: number;
  compliantCommits: number;
  nonCompliantCommits: number;
  connected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCreateInput {
  name: string;
  repository: string;
  description?: string;
}

const PROJECTS_KEY = 'projects';

/**
 * Validator for Project object
 */
export function isValidProject(data: unknown): data is Project {
  if (typeof data !== 'object' || data === null) return false;

  const project = data as Record<string, unknown>;
  return (
    typeof project.id === 'string' &&
    typeof project.name === 'string' &&
    typeof project.repository === 'string' &&
    typeof project.lastCommit === 'string' &&
    typeof project.lastCommitMessage === 'string' &&
    typeof project.status === 'string' &&
    ['pass', 'fail', 'warning'].includes(project.status as string) &&
    typeof project.totalCommits === 'number' &&
    typeof project.compliantCommits === 'number' &&
    typeof project.nonCompliantCommits === 'number'
  );
}

/**
 * Validator for projects array
 */
export function isValidProjectsArray(data: unknown): data is Project[] {
  return Array.isArray(data) && data.every(isValidProject);
}

/**
 * Generate a unique project ID
 */
function generateProjectId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all projects for a user
 */
export function getProjects(uid: string | null = null): Project[] {
  return getStorageItem<Project[]>(PROJECTS_KEY, uid, {
    fallback: [],
    validate: isValidProjectsArray,
  }) ?? [];
}

/**
 * Get a single project by ID
 */
export function getProject(id: string, uid: string | null = null): Project | null {
  const projects = getProjects(uid);
  return projects.find((p) => p.id === id) ?? null;
}

/**
 * Create a new project
 */
export function createProject(
  input: ProjectCreateInput,
  uid: string | null = null
): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: generateProjectId(),
    name: input.name,
    repository: input.repository,
    description: input.description ?? '',
    lastCommit: 'No commits yet',
    lastCommitMessage: '',
    lastCommitHash: '',
    lastCommitAuthor: '',
    lastCommitDate: now,
    status: 'pass',
    totalCommits: 0,
    compliantCommits: 0,
    nonCompliantCommits: 0,
    connected: true,
    createdAt: now,
    updatedAt: now,
  };

  const projects = getProjects(uid);
  const updated = [...projects, project];
  setStorageItem(PROJECTS_KEY, updated, uid);

  return project;
}

/**
 * Update an existing project
 */
export function updateProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt'>>,
  uid: string | null = null
): Project | null {
  const projects = getProjects(uid);
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const existingProject = projects[index];
  if (!existingProject) return null;

  const updated: Project = {
    ...existingProject,
    ...updates,
    id: existingProject.id,
    createdAt: existingProject.createdAt,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updated;
  setStorageItem(PROJECTS_KEY, projects, uid);

  return updated;
}

/**
 * Delete a project
 */
export function deleteProject(id: string, uid: string | null = null): boolean {
  const projects = getProjects(uid);
  const filtered = projects.filter((p) => p.id !== id);

  if (filtered.length === projects.length) return false;

  setStorageItem(PROJECTS_KEY, filtered, uid);
  return true;
}

/**
 * Update project statistics based on validation history
 * This simulates what the backend would calculate from commit history
 */
export function updateProjectStats(
  projectId: string,
  validationResult: { valid: boolean; message: string; timestamp: string; author?: string; hash?: string },
  uid: string | null = null
): Project | null {
  const project = getProject(projectId, uid);
  if (!project) return null;

  const totalCommits = project.totalCommits + 1;
  const compliantCommits = project.compliantCommits + (validationResult.valid ? 1 : 0);
  const nonCompliantCommits = project.nonCompliantCommits + (validationResult.valid ? 0 : 1);

  // Determine status based on recent compliance
  let status: ProjectStatus;
  if (validationResult.valid) {
    status = 'pass';
  } else {
    // If more than 30% are non-compliant, mark as fail, otherwise warning
    const nonCompliantPercentage = (nonCompliantCommits / totalCommits) * 100;
    status = nonCompliantPercentage > 30 ? 'fail' : 'warning';
  }

  return updateProject(
    projectId,
    {
      lastCommit: new Date(validationResult.timestamp).toLocaleString(),
      lastCommitMessage: validationResult.message,
      lastCommitHash: validationResult.hash ?? '',
      lastCommitAuthor: validationResult.author ?? '',
      lastCommitDate: validationResult.timestamp,
      status,
      totalCommits,
      compliantCommits,
      nonCompliantCommits,
    },
    uid
  );
}

/**
 * Get aggregate statistics across all projects
 */
export function getAggregateStats(uid: string | null = null): {
  totalProjects: number;
  totalCommits: number;
  compliantCommits: number;
  nonCompliantCommits: number;
  compliancePercentage: number;
} {
  const projects = getProjects(uid);

  const stats = projects.reduce(
    (acc, project) => ({
      totalCommits: acc.totalCommits + project.totalCommits,
      compliantCommits: acc.compliantCommits + project.compliantCommits,
      nonCompliantCommits: acc.nonCompliantCommits + project.nonCompliantCommits,
    }),
    { totalCommits: 0, compliantCommits: 0, nonCompliantCommits: 0 }
  );

  const compliancePercentage =
    stats.totalCommits > 0
      ? Math.round((stats.compliantCommits / stats.totalCommits) * 100)
      : 0;

  return {
    totalProjects: projects.length,
    ...stats,
    compliancePercentage,
  };
}

/**
 * Initialize demo projects for new users
 */
export function initializeDemoProjects(uid: string | null = null): Project[] {
  const existing = getProjects(uid);
  if (existing.length > 0) return existing;

  const demoProjects: ProjectCreateInput[] = [
    {
      name: 'project-phoenix',
      repository: 'github.com/yourorg/project-phoenix',
      description: 'Main product application with user authentication',
    },
    {
      name: 'apollo-gateway',
      repository: 'github.com/yourorg/apollo-gateway',
      description: 'API gateway and microservices orchestration',
    },
    {
      name: 'mobile-app-v2',
      repository: 'github.com/yourorg/mobile-app-v2',
      description: 'Next-generation mobile application',
    },
  ];

  const created = demoProjects.map((input) => createProject(input, uid));

  // Add some simulated commit history
  if (created.length > 0 && created[0]) {
    updateProject(
      created[0].id,
      {
        lastCommit: '2 hours ago',
        lastCommitMessage: 'feat(auth): implement magic link login',
        lastCommitHash: 'a1b2c3d',
        lastCommitAuthor: 'Alice',
        lastCommitDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'pass',
        totalCommits: 150,
        compliantCommits: 135,
        nonCompliantCommits: 15,
      },
      uid
    );
  }

  if (created.length > 1 && created[1]) {
    updateProject(
      created[1].id,
      {
        lastCommit: '1 day ago',
        lastCommitMessage: 'fix login button',
        lastCommitHash: 'f4e5d6c',
        lastCommitAuthor: 'Bob',
        lastCommitDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'fail',
        totalCommits: 89,
        compliantCommits: 45,
        nonCompliantCommits: 44,
      },
      uid
    );
  }

  if (created.length > 2 && created[2]) {
    updateProject(
      created[2].id,
      {
        lastCommit: '5 hours ago',
        lastCommitMessage: 'refactor: update dependencies and remove unused packages',
        lastCommitHash: '7g8h9i0',
        lastCommitAuthor: 'Charlie',
        lastCommitDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'warning',
        totalCommits: 234,
        compliantCommits: 198,
        nonCompliantCommits: 36,
      },
      uid
    );
  }

  return getProjects(uid);
}

