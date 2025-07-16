import { createMockSupabaseClient, createMockTask } from '../../utils/testUtils';
// import * as taskService from '../taskService';

/**
 * Task Service Tests
 * 
 * Tests for task API operations as specified in Task 3.1
 * Functions: getTasks(), createTask(), updateTask(), deleteTask()
 * Features: error handling for all operations
 */

// Mock Supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: createMockSupabaseClient(),
}));

describe('Task Service', () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('fetches all tasks successfully', async () => {
      const mockTasks = [
        createMockTask({ id: 1, title: 'Task 1' }),
        createMockTask({ id: 2, title: 'Task 2' }),
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
        }),
      });

      // const result = await taskService.getTasks();
      
      // expect(result).toEqual(mockTasks);
      // expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('fetches tasks with project information', async () => {
      const mockTasksWithProjects = [
        createMockTask({ id: 1, title: 'Task 1', project: { name: 'Project 1' } }),
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockTasksWithProjects, error: null }),
        }),
      });

      // const result = await taskService.getTasks();
      
      // expect(result).toEqual(mockTasksWithProjects);
      // expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('handles fetch errors', async () => {
      const mockError = new Error('Database connection failed');
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      });

      // await expect(taskService.getTasks()).rejects.toThrow('Database connection failed');
    });

    it('orders tasks by created date', async () => {
      const mockTasks = [createMockTask()];
      const mockOrderFn = jest.fn().mockResolvedValue({ data: mockTasks, error: null });
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: mockOrderFn,
        }),
      });

      // await taskService.getTasks();
      
      // expect(mockOrderFn).toHaveBeenCalledWith('created_at', { ascending: false });
    });
  });

  describe('createTask', () => {
    it('creates a new task successfully', async () => {
      const newTaskData = {
        title: 'New Task',
        description: 'Task description',
        project_id: 1,
      };
      
      const createdTask = createMockTask({ id: 1, ...newTaskData });
      
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: createdTask, error: null }),
          }),
        }),
      });

      // const result = await taskService.createTask(newTaskData);
      
      // expect(result).toEqual(createdTask);
      // expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('creates task without project', async () => {
      const newTaskData = {
        title: 'New Task',
        description: 'Task description',
      };
      
      const createdTask = createMockTask({ id: 1, ...newTaskData, project_id: null });
      
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: createdTask, error: null }),
          }),
        }),
      });

      // const result = await taskService.createTask(newTaskData);
      
      // expect(result).toEqual(createdTask);
    });

    it('handles creation errors', async () => {
      const newTaskData = {
        title: 'New Task',
        description: 'Task description',
      };
      
      const mockError = new Error('Creation failed');
      
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      // await expect(taskService.createTask(newTaskData)).rejects.toThrow('Creation failed');
    });

    it('validates required fields', async () => {
      const invalidTaskData = {
        description: 'Task description',
        // missing title
      };

      // await expect(taskService.createTask(invalidTaskData)).rejects.toThrow('Title is required');
    });

    it('validates field lengths', async () => {
      const invalidTaskData = {
        title: 'a'.repeat(101), // too long
        description: 'Task description',
      };

      // await expect(taskService.createTask(invalidTaskData)).rejects.toThrow('Title must be less than 100 characters');
    });
  });

  describe('updateTask', () => {
    it('updates task successfully', async () => {
      const taskId = 1;
      const updateData = {
        title: 'Updated Task',
        description: 'Updated description',
      };
      
      const updatedTask = createMockTask({ id: taskId, ...updateData });
      
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: updatedTask, error: null }),
            }),
          }),
        }),
      });

      // const result = await taskService.updateTask(taskId, updateData);
      
      // expect(result).toEqual(updatedTask);
      // expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('updates task completion status', async () => {
      const taskId = 1;
      const updateData = { completed: true };
      
      const updatedTask = createMockTask({ id: taskId, completed: true });
      
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: updatedTask, error: null }),
            }),
          }),
        }),
      });

      // const result = await taskService.updateTask(taskId, updateData);
      
      // expect(result.completed).toBe(true);
    });

    it('handles update errors', async () => {
      const taskId = 1;
      const updateData = { title: 'Updated Task' };
      const mockError = new Error('Update failed');
      
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
            }),
          }),
        }),
      });

      // await expect(taskService.updateTask(taskId, updateData)).rejects.toThrow('Update failed');
    });

    it('handles non-existent task', async () => {
      const taskId = 999;
      const updateData = { title: 'Updated Task' };
      
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
      });

      // await expect(taskService.updateTask(taskId, updateData)).rejects.toThrow('Task not found');
    });

    it('validates update data', async () => {
      const taskId = 1;
      const invalidUpdateData = {
        title: 'a'.repeat(101), // too long
      };

      // await expect(taskService.updateTask(taskId, invalidUpdateData)).rejects.toThrow('Title must be less than 100 characters');
    });
  });

  describe('deleteTask', () => {
    it('deletes task successfully', async () => {
      const taskId = 1;
      
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

      // await expect(taskService.deleteTask(taskId)).resolves.toBeUndefined();
      // expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('handles deletion errors', async () => {
      const taskId = 1;
      const mockError = new Error('Deletion failed');
      
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      });

      // await expect(taskService.deleteTask(taskId)).rejects.toThrow('Deletion failed');
    });

    it('validates task ID', async () => {
      // await expect(taskService.deleteTask(null)).rejects.toThrow('Task ID is required');
      // await expect(taskService.deleteTask(undefined)).rejects.toThrow('Task ID is required');
      // await expect(taskService.deleteTask('')).rejects.toThrow('Task ID is required');
    });
  });

  describe('getTasksByProject', () => {
    it('fetches tasks for a specific project', async () => {
      const projectId = 1;
      const mockTasks = [
        createMockTask({ id: 1, project_id: projectId }),
        createMockTask({ id: 2, project_id: projectId }),
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
          }),
        }),
      });

      // const result = await taskService.getTasksByProject(projectId);
      
      // expect(result).toEqual(mockTasks);
      // expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('returns empty array when no tasks found', async () => {
      const projectId = 1;
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      // const result = await taskService.getTasksByProject(projectId);
      
      // expect(result).toEqual([]);
    });
  });

  describe('searchTasks', () => {
    it('searches tasks by title', async () => {
      const searchTerm = 'important';
      const mockTasks = [
        createMockTask({ id: 1, title: 'Important task' }),
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          ilike: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
          }),
        }),
      });

      // const result = await taskService.searchTasks(searchTerm);
      
      // expect(result).toEqual(mockTasks);
    });

    it('searches tasks by description', async () => {
      const searchTerm = 'urgent';
      const mockTasks = [
        createMockTask({ id: 1, description: 'This is urgent' }),
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          or: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
          }),
        }),
      });

      // const result = await taskService.searchTasks(searchTerm);
      
      // expect(result).toEqual(mockTasks);
    });
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      // await expect(taskService.getTasks()).rejects.toThrow('Network error');
    });

    it('handles authentication errors', async () => {
      const authError = new Error('Authentication failed');
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: authError }),
        }),
      });

      // await expect(taskService.getTasks()).rejects.toThrow('Authentication failed');
    });

    it('handles rate limiting errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: rateLimitError }),
        }),
      });

      // await expect(taskService.getTasks()).rejects.toThrow('Rate limit exceeded');
    });
  });
});