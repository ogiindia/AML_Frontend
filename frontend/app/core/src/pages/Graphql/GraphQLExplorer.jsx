import React, { useEffect, useState } from 'react';
// import GraphiQL  to have access to GraphiQL  tools
import { GraphiQL } from 'graphiql';
import 'graphiql/style.css';
import { GRAPHQL_URL } from '../../config';

const GRAPHQL_ENDPOINT = GRAPHQL_URL; // Spring Boot GraphQL path

const GraphQLExplorer = () => {
  const [theme, setTheme] = React.useState('dark');
  const [query, setQuery] = useState('');
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Load history from localStorage
  useEffect(() => {
    const storedTabs = localStorage.getItem('graphql_tabs');
    if (storedTabs) {
      const parsed = JSON.parse(storedTabs);
      setTabs(parsed);
      setQuery(parsed[0] || '');
    } else {
      setTabs(['']);
    }
  }, []);

  // Save history on tab change
  useEffect(() => {
    localStorage.setItem('graphql_tabs', JSON.stringify(tabs));
  }, [tabs]);

  const fetcher = async (graphQLParams) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(graphQLParams),
      });

      if (!response.ok) {
        console.error(`GraphQL endpoint error: ${response.status} ${response.statusText}`);
        return { errors: [{ message: `HTTP ${response.status}: ${response.statusText}` }] };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetcher error:', error);
      return { errors: [{ message: error.message }] };
    }
  };

  const handleQueryChange = (newQuery) => {
    const newTabs = [...tabs];
    newTabs[activeTab] = newQuery;
    setTabs(newTabs);
    setQuery(newQuery);
  };

  const addTab = () => {
    setTabs([...tabs, '']);
    setActiveTab(tabs.length);
  };

  const closeTab = (index) => {
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    setActiveTab(Math.max(0, index - 1));
    setQuery(newTabs[Math.max(0, index - 1)] || '');
  };

  // Create explorer plugin with options
  const explorer = explorerPlugin();

  return (
    <>
      <div style={{ height: '100vh', width: '100%' }}>
        <GraphiQL
          fetcher={fetcher}
          query={query}
          onEditQuery={setQuery}

        />
      </div>
    </>
  );
};

export default GraphQLExplorer;
