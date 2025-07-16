import React from 'react';
import Layout from '../../delhi/todo-app/src/components/Layout';
import ProjectList from './components/ProjectList';
import '../../delhi/todo-app/src/index.css';

const App = () => {
  return (
    <Layout>
      <ProjectList />
    </Layout>
  );
};

export default App;