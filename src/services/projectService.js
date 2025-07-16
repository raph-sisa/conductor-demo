/**
 * Project API Service
 * 
 * This service provides functions for managing projects in the todo application.
 * It handles all CRUD operations for projects and includes proper error handling.
 * 
 * @module ProjectService
 */

import { supabase } from '../lib/supabase';

/**
 * Custom error class for project service operations
 */
class ProjectServiceError extends Error {
  constructor(message, code, originalError) {
    super(message);
    this.name = 'ProjectServiceError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier for the project
 * @property {string} name - Project name (required, min 1 character)
 * @property {string} [description] - Project description (optional)
 * @property {string} created_at - Timestamp when the project was created
 * @property {string} updated_at - Timestamp when the project was last updated
 */

/**
 * @typedef {Object} CreateProjectData
 * @property {string} name - Project name (required, min 1 character)
 * @property {string} [description] - Project description (optional)
 */

/**
 * @typedef {Object} UpdateProjectData
 * @property {string} [name] - Updated project name (min 1 character if provided)
 * @property {string} [description] - Updated project description
 */

/**
 * Validates project data for creation
 * @param {CreateProjectData} data - Project data to validate
 * @throws {ProjectServiceError} When validation fails
 */
const validateCreateData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new ProjectServiceError('Invalid project data provided', 'INVALID_DATA');
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new ProjectServiceError('Project name is required and must be a non-empty string', 'INVALID_NAME');
  }

  if (data.name.trim().length > 255) {
    throw new ProjectServiceError('Project name cannot exceed 255 characters', 'NAME_TOO_LONG');
  }

  if (data.description && typeof data.description !== 'string') {
    throw new ProjectServiceError('Project description must be a string', 'INVALID_DESCRIPTION');
  }
};

/**
 * Validates project data for updates
 * @param {UpdateProjectData} data - Project data to validate
 * @throws {ProjectServiceError} When validation fails
 */
const validateUpdateData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new ProjectServiceError('Invalid project data provided', 'INVALID_DATA');
  }

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new ProjectServiceError('Project name must be a non-empty string', 'INVALID_NAME');
    }
    if (data.name.trim().length > 255) {
      throw new ProjectServiceError('Project name cannot exceed 255 characters', 'NAME_TOO_LONG');
    }
  }

  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    throw new ProjectServiceError('Project description must be a string', 'INVALID_DESCRIPTION');
  }
};

/**
 * Validates project ID
 * @param {string} id - Project ID to validate
 * @throws {ProjectServiceError} When validation fails
 */
const validateProjectId = (id) => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new ProjectServiceError('Project ID is required and must be a non-empty string', 'INVALID_ID');
  }
};

/**
 * Handles Supabase errors and converts them to ProjectServiceError
 * @param {Object} error - Supabase error object
 * @param {string} operation - The operation that failed
 * @throws {ProjectServiceError} Converted error
 */
const handleSupabaseError = (error, operation) => {
  console.error(`Project service error during ${operation}:`, error);

  // Handle specific Supabase error codes
  if (error.code === 'PGRST116') {
    throw new ProjectServiceError('Database table not found. Please check your database setup.', 'TABLE_NOT_FOUND', error);
  }
  
  if (error.code === '23505') {
    throw new ProjectServiceError('A project with this name already exists', 'DUPLICATE_PROJECT', error);
  }

  if (error.code === '23503') {
    throw new ProjectServiceError('Cannot delete project: it has associated tasks', 'FOREIGN_KEY_CONSTRAINT', error);
  }

  if (error.code === '42501') {
    throw new ProjectServiceError('Access denied. Please check your authentication.', 'ACCESS_DENIED', error);
  }

  // Default error handling
  const message = error.message || `Failed to ${operation} project`;
  throw new ProjectServiceError(message, 'UNKNOWN_ERROR', error);
};

/**
 * Retrieves all projects from the database
 * @returns {Promise<Project[]>} Array of project objects
 * @throws {ProjectServiceError} When the operation fails
 */
export const getProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'fetch');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ProjectServiceError) {
      throw error;
    }
    throw new ProjectServiceError('Failed to fetch projects', 'FETCH_ERROR', error);
  }
};

/**
 * Retrieves a single project by ID
 * @param {string} projectId - The ID of the project to retrieve
 * @returns {Promise<Project>} The project object
 * @throws {ProjectServiceError} When the operation fails or project not found
 */
export const getProjectById = async (projectId) => {
  try {
    validateProjectId(projectId);

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ProjectServiceError('Project not found', 'PROJECT_NOT_FOUND', error);
      }
      handleSupabaseError(error, 'fetch');
    }

    return data;
  } catch (error) {
    if (error instanceof ProjectServiceError) {
      throw error;
    }
    throw new ProjectServiceError('Failed to fetch project', 'FETCH_ERROR', error);
  }
};

/**
 * Creates a new project in the database
 * @param {CreateProjectData} projectData - The project data to create
 * @returns {Promise<Project>} The created project object
 * @throws {ProjectServiceError} When the operation fails
 */
export const createProject = async (projectData) => {
  try {
    validateCreateData(projectData);

    // Sanitize data
    const sanitizedData = {
      name: projectData.name.trim(),
      description: projectData.description?.trim() || null
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'create');
    }

    return data;
  } catch (error) {
    if (error instanceof ProjectServiceError) {
      throw error;
    }
    throw new ProjectServiceError('Failed to create project', 'CREATE_ERROR', error);
  }
};

/**
 * Updates an existing project in the database
 * @param {string} projectId - The ID of the project to update
 * @param {UpdateProjectData} projectData - The updated project data
 * @returns {Promise<Project>} The updated project object
 * @throws {ProjectServiceError} When the operation fails
 */
export const updateProject = async (projectId, projectData) => {
  try {
    validateProjectId(projectId);
    validateUpdateData(projectData);

    // Check if there's anything to update
    if (Object.keys(projectData).length === 0) {
      throw new ProjectServiceError('No data provided for update', 'NO_UPDATE_DATA');
    }

    // Sanitize data
    const sanitizedData = {};
    if (projectData.name !== undefined) {
      sanitizedData.name = projectData.name.trim();
    }
    if (projectData.description !== undefined) {
      sanitizedData.description = projectData.description?.trim() || null;
    }

    const { data, error } = await supabase
      .from('projects')
      .update(sanitizedData)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'update');
    }

    if (!data) {
      throw new ProjectServiceError('Project not found', 'PROJECT_NOT_FOUND');
    }

    return data;
  } catch (error) {
    if (error instanceof ProjectServiceError) {
      throw error;
    }
    throw new ProjectServiceError('Failed to update project', 'UPDATE_ERROR', error);
  }
};

/**
 * Deletes a project from the database
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<void>} Resolves when the project is deleted
 * @throws {ProjectServiceError} When the operation fails
 */
export const deleteProject = async (projectId) => {
  try {
    validateProjectId(projectId);

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      handleSupabaseError(error, 'delete');
    }
  } catch (error) {
    if (error instanceof ProjectServiceError) {
      throw error;
    }
    throw new ProjectServiceError('Failed to delete project', 'DELETE_ERROR', error);
  }
};

/**
 * Retrieves projects with their task counts
 * @returns {Promise<Array<Project & {task_count: number}>>} Array of projects with task counts
 * @throws {ProjectServiceError} When the operation fails
 */
export const getProjectsWithTaskCounts = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        tasks(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'fetch');
    }

    // Transform the data to include task_count
    return (data || []).map(project => ({
      ...project,
      task_count: project.tasks?.[0]?.count || 0,
      tasks: undefined // Remove the tasks array from the response
    }));
  } catch (error) {
    if (error instanceof ProjectServiceError) {
      throw error;
    }
    throw new ProjectServiceError('Failed to fetch projects with task counts', 'FETCH_ERROR', error);
  }
};

/**
 * Searches projects by name
 * @param {string} searchTerm - The search term to filter projects
 * @returns {Promise<Project[]>} Array of matching projects
 * @throws {ProjectServiceError} When the operation fails
 */
export const searchProjects = async (searchTerm) => {
  try {
    if (!searchTerm || typeof searchTerm !== 'string') {
      throw new ProjectServiceError('Search term is required and must be a string', 'INVALID_SEARCH_TERM');
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .ilike('name', `%${searchTerm.trim()}%`)
      .order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'search');
    }

    return data || [];
  } catch (error) {
    if (error instanceof ProjectServiceError) {
      throw error;
    }
    throw new ProjectServiceError('Failed to search projects', 'SEARCH_ERROR', error);
  }
};

// Export the custom error class for use in other modules
export { ProjectServiceError };

// Export default object with all functions for easier importing
export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsWithTaskCounts,
  searchProjects,
  ProjectServiceError
};