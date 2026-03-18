import api from '@ais/api';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import { useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * 
 * @returns oleBasedNavigate('1101', true, {
             state: {
               status: data ? 'success' : 'error',
               message: data
                 ? 'Record inserted or updated successfully'
                 : 'Record action not successful please try again later. code : ' +
                   error,
             },
           });
 */

function useRoleBasedNavigate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //  const [data, setdata] = useState(null);

  const rawQuery = {
    query: {
      __variables: {
        path: 'String!',
      },

      entityIsValid: {
        __args: {
          tId: new VariableType('path'),
        },
        showInMenu: true,
        path: true,
        page: true,
        ent: {
          id: true,
        },
      },
    },
  };

  const roleBasedNavigate = async (tId, replace = false, state = null) => {
    setLoading(true);
    try {
      const gqlquery = jsonToGraphQLQuery(rawQuery);
      api.graphql(gqlquery, { path: tId }).then((res) => {
        const { loading, data, error } = res;

        if (error) setError(error);
        if (loading) setLoading(loading);

        if (data) {
          navigate(data['entityIsValid']['path'], { replace, state });
        }
      });
    } catch (error) {
      console.log(`Error checking user Role: `, error);
      setError(`Error occured while verifing role`);
    } finally {
      setLoading(false);
    }
  };

  return { roleBasedNavigate, loading, error };
}

export default useRoleBasedNavigate;
