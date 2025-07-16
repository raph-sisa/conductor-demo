import { supabase } from '../lib/supabase';

/**
 * Task Service
 * 
 * API service for task operations as specified in Task 3.1
 * Functions: getTasks(), createTask(), updateTask(), deleteTask()
 * Features: error handling for all operations
 */

// Validation constants
const VALIDATION_RULES = {
  title: {
    required: true,
    maxLength: 255,
    minLength: 1,
  },
  description: {
    required: false,
    maxLength: 2000,
  },
  priority: {
    required: false,
    allowedValues: ['low', 'medium', 'high'],
  },
};

/**
 * Validate task data
 * @param {Object} taskData - Task data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @throws {Error} If validation fails
 */
const validateTaskData = (taskData, isUpdate = false) => {
  const errors = [];

  // Validate title
  if (!isUpdate && !taskData.title) {
    errors.push('Title is required');
  }
  
  if (taskData.title !== undefined) {
    if (typeof taskData.title !== 'string') {
      errors.push('Title must be a string');
    } else if (taskData.title.length < VALIDATION_RULES.title.minLength) {
      errors.push('Title cannot be empty');
    } else if (taskData.title.length > VALIDATION_RULES.title.maxLength) {
      errors.push('Title must be less than 256 characters');
    }
  }

  // Validate description
  if (taskData.description !== undefined && taskData.description !== null) {
    if (typeof taskData.description !== 'string') {
      errors.push('Description must be a string');
    } else if (taskData.description.length > VALIDATION_RULES.description.maxLength) {
      errors.push('Description must be less than 2000 characters');
    }
  }

  // Validate priority
  if (taskData.priority !== undefined) {
    if (!VALIDATION_RULES.priority.allowedValues.includes(taskData.priority)) {
      errors.push('Priority must be one of: low, medium, high');
    }
  }

  // Validate completed status
  if (taskData.completed !== undefined && typeof taskData.completed !== 'boolean') {
    errors.push('Completed must be a boolean');
  }

  // Validate project_id
  if (taskData.project_id !== undefined && taskData.project_id !== null) {
    if (typeof taskData.project_id !== 'string' && typeof taskData.project_id !== 'number') {
      errors.push('Project ID must be a valid identifier');
    }
  }

  // Validate due_date
  if (taskData.due_date !== undefined && taskData.due_date !== null) {
    const date = new Date(taskData.due_date);
    if (isNaN(date.getTime())) {
      errors.push('Due date must be a valid date');
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};

/**
 * Handle Supabase response and errors
 * @param {Object} response - Supabase response object
 * @param {string} operation - Operation name for error messages
 * @returns {*} Response data
 * @throws {Error} If operation failed
 */
const handleResponse = (response, operation) => {
  const { data, error } = response;
  
  if (error) {
    console.error(`${operation} failed:`, error);
    
    // Handle specific error types
    if (error.code === 'PGRST116') {
      throw new Error('Database table not found. Please run database migrations.');
    }
    
    if (error.code === '23505') {
      throw new Error('A task with this information already exists');
    }
    
    if (error.code === '23503') {
      throw new Error('Invalid project reference');
    }
    
    if (error.code === '42501') {
      throw new Error('Permission denied. Please check your authentication.');
    }
    
    // Generic error handling
    throw new Error(error.message || `${operation} failed`);
  }
  
  return data;
};

/**
 * Get all tasks with optional project information
 * @param {Object} options - Query options
 * @param {string} options.projectId - Filter by project ID
 * @param {boolean} options.includeProject - Include project information
 * @returns {Promise<Array>} Array of tasks
 */
export const getTasks = async (options = {}) => {
  try {
    let query = supabase.from('tasks').select('*');
    
    // Include project information if requested
    if (options.includeProject) {
      query = query.select(`
        *,
        project:projects(*)
      `);
    }
    
    // Filter by project if specified
    if (options.projectId) {
      query = query.eq('project_id', options.projectId);
    }
    
    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false });
    
    const response = await query;
    return handleResponse(response, 'Get tasks');
  } catch (error) {
    console.error('Error in getTasks:', error);
    throw error;
  }
};

/**
 * Get tasks by project ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} Array of tasks for the project
 */
export const getTasksByProject = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    const response = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    return handleResponse(response, 'Get tasks by project');
  } catch (error) {
    console.error('Error in getTasksByProject:', error);
    throw error;
  }
};

/**
 * Search tasks by title and description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching tasks
 */
export const searchTasks = async (searchTerm) => {
  try {
    if (!searchTerm || typeof searchTerm !== 'string') {
      throw new Error('Search term is required');
    }
    
    const searchPattern = `%${searchTerm}%`;
    
    const response = await supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
      .order('created_at', { ascending: false });
    
    return handleResponse(response, 'Search tasks');
  } catch (error) {
    console.error('Error in searchTasks:', error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} taskData.description - Task description (optional)
 * @param {string} taskData.project_id - Project ID (optional)
 * @param {string} taskData.priority - Priority level (optional, default: 'medium')
 * @param {string} taskData.due_date - Due date (optional)
 * @returns {Promise<Object>} Created task object
 */
export const createTask = async (taskData) => {
  try {
    // Validate input data
    validateTaskData(taskData);
    
    // Prepare task data with defaults
    const taskToCreate = {
      title: taskData.title,
      description: taskData.description || null,
      project_id: taskData.project_id || null,
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date || null,
      completed: false,
    };
    
    const response = await supabase
      .from('tasks')
      .insert([taskToCreate])
      .select()
      .single();
    
    return handleResponse(response, 'Create task');
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param {string} taskId - Task ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = async (taskId, updateData) => {
  try {
    // Validate task ID
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    // Validate update data
    validateTaskData(updateData, true);
    
    // Remove undefined values from update data
    const cleanUpdateData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    if (Object.keys(cleanUpdateData).length === 0) {
      throw new Error('No valid update data provided');
    }
    
    const response = await supabase
      .from('tasks')
      .update(cleanUpdateData)
      .eq('id', taskId)
      .select()
      .single();
    
    const updatedTask = handleResponse(response, 'Update task');
    
    // Check if task was found
    if (!updatedTask) {
      throw new Error('Task not found');
    }
    
    return updatedTask;
  } catch (error) {
    console.error('Error in updateTask:', error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId) => {
  try {
    // Validate task ID
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    const response = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    handleResponse(response, 'Delete task');
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error;
  }
};

/**
 * Toggle task completion status
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} Updated task object
 */
export const toggleTaskCompletion = async (taskId) => {
  try {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    // First get the current task to determine new completion status
    const { data: currentTask, error: fetchError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', taskId)
      .single();
    
    if (fetchError) {
      throw new Error('Task not found');
    }
    
    // Toggle the completion status
    const newCompletionStatus = !currentTask.completed;
    
    return await updateTask(taskId, { completed: newCompletionStatus });
  } catch (error) {
    console.error('Error in toggleTaskCompletion:', error);
    throw error;
  }
};

/**
 * Get task statistics
 * @param {string} projectId - Optional project ID to filter by
 * @returns {Promise<Object>} Task statistics
 */
export const getTaskStats = async (projectId = null) => {
  try {
    let query = supabase.from('tasks').select('completed');
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const response = await query;
    const tasks = handleResponse(response, 'Get task statistics');
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length,
      completionRate: tasks.length > 0 ? (tasks.filter(task => task.completed).length / tasks.length) * 100 : 0,
    };
    
    return stats;
  } catch (error) {
    console.error('Error in getTaskStats:', error);
    throw error;
  }
};

// Export all functions for easy testing
export default {
  getTasks,
  getTasksByProject,
  searchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats,
};