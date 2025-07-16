// Database Schema Test using Supabase Client
// Description: Tests the database schema functionality using JavaScript
// Usage: Run this file with Node.js after setting up the database
// Created: 2025-07-16

const { supabase } = require('../lib/supabase');

async function testDatabaseSchema() {
  console.log('🧪 Starting database schema tests...\n');
  
  try {
    // Test 1: Test connection
    console.log('1. Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('projects')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Database connection successful\n');

    // Test 2: Create a test project
    console.log('2. Creating test project...');
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([
        { name: 'Test Project JS', description: 'Testing project creation from JavaScript' }
      ])
      .select();
    
    if (projectError) {
      console.error('❌ Project creation failed:', projectError.message);
      return;
    }
    console.log('✅ Project created:', project[0].name);
    const testProjectId = project[0].id;

    // Test 3: Create test tasks
    console.log('3. Creating test tasks...');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .insert([
        { 
          title: 'Test Task 1', 
          description: 'First test task', 
          project_id: testProjectId,
          priority: 'high'
        },
        { 
          title: 'Test Task 2', 
          description: 'Second test task', 
          project_id: testProjectId,
          priority: 'medium',
          completed: true
        }
      ])
      .select();
    
    if (tasksError) {
      console.error('❌ Task creation failed:', tasksError.message);
      return;
    }
    console.log('✅ Tasks created:', tasks.length);

    // Test 4: Query projects with tasks
    console.log('4. Querying projects with tasks...');
    const { data: projectsWithTasks, error: queryError } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        description,
        created_at,
        tasks (
          id,
          title,
          description,
          completed,
          priority,
          due_date,
          created_at
        )
      `)
      .eq('name', 'Test Project JS');
    
    if (queryError) {
      console.error('❌ Query failed:', queryError.message);
      return;
    }
    console.log('✅ Query successful. Project with tasks:');
    console.log(JSON.stringify(projectsWithTasks[0], null, 2));

    // Test 5: Update task
    console.log('5. Updating task...');
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({ completed: true, description: 'Updated test task' })
      .eq('title', 'Test Task 1')
      .select();
    
    if (updateError) {
      console.error('❌ Task update failed:', updateError.message);
      return;
    }
    console.log('✅ Task updated:', updatedTask[0].title);

    // Test 6: Test foreign key constraint
    console.log('6. Testing foreign key constraint...');
    const { data: invalidTask, error: fkError } = await supabase
      .from('tasks')
      .insert([
        { 
          title: 'Invalid Task', 
          project_id: '00000000-0000-0000-0000-000000000000' 
        }
      ]);
    
    if (fkError) {
      console.log('✅ Foreign key constraint working (expected error):', fkError.message);
    } else {
      console.error('❌ Foreign key constraint not working - invalid task created');
    }

    // Test 7: Test cascade deletion
    console.log('7. Testing cascade deletion...');
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('name', 'Test Project JS');
    
    if (deleteError) {
      console.error('❌ Project deletion failed:', deleteError.message);
      return;
    }
    
    // Verify tasks were deleted
    const { data: remainingTasks, error: checkError } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', testProjectId);
    
    if (checkError) {
      console.error('❌ Task check failed:', checkError.message);
      return;
    }
    
    if (remainingTasks.length === 0) {
      console.log('✅ Cascade deletion working - tasks deleted with project');
    } else {
      console.error('❌ Cascade deletion not working - tasks remain');
    }

    // Test 8: Test data validation
    console.log('8. Testing data validation...');
    const { data: invalidProject, error: validationError } = await supabase
      .from('projects')
      .insert([{ name: '' }]); // Empty name should fail
    
    if (validationError) {
      console.log('✅ Data validation working (expected error):', validationError.message);
    } else {
      console.error('❌ Data validation not working - empty name accepted');
    }

    // Test 9: Test priority validation
    console.log('9. Testing priority validation...');
    const { data: testProject2, error: project2Error } = await supabase
      .from('projects')
      .insert([{ name: 'Priority Test Project' }])
      .select();
    
    if (project2Error) {
      console.error('❌ Priority test project creation failed:', project2Error.message);
      return;
    }

    const { data: invalidPriorityTask, error: priorityError } = await supabase
      .from('tasks')
      .insert([
        { 
          title: 'Invalid Priority Task', 
          priority: 'invalid',
          project_id: testProject2[0].id
        }
      ]);
    
    if (priorityError) {
      console.log('✅ Priority validation working (expected error):', priorityError.message);
    } else {
      console.error('❌ Priority validation not working - invalid priority accepted');
    }

    // Cleanup
    console.log('10. Cleaning up test data...');
    await supabase.from('projects').delete().eq('name', 'Priority Test Project');
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All database schema tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
if (require.main === module) {
  testDatabaseSchema();
}

module.exports = { testDatabaseSchema };