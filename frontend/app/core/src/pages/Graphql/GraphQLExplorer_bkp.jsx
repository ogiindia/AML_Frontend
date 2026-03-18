import { explorerPlugin } from '@graphiql/plugin-explorer';
import { GraphiQL } from 'graphiql';

// import 'graphiql/graphiql.css';
import 'graphiql/style.css';
import { useEffect, useRef, useState } from 'react';
import { GRAPHQL_URL } from '../../config';

const GRAPHQL_ENDPOINT = GRAPHQL_URL; // Spring Boot GraphQL path

const GraphQLExplorer = () => {
  const [theme, setTheme] = useState('dark');
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
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
    });
    return response.json();
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

  const explorerPluginInstance = useRef(
    explorerPlugin({
      title: 'Explorer', // Ensure this is unique
      showAtStartup: true,
    }),
  );

  return (
    <>
      <div style={{ height: '100vh' }}>
        <GraphiQL
          fetcher={fetcher}
          initialQuery={query}
          onEditQuery={handleQueryChange}
          editorTheme={theme === 'dark' ? 'dracula' : 'default'}
          defaultEditorToolsVisibility={true}
        />
      </div>
    </>
  );
};

export default GraphQLExplorer;
