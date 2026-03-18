/* eslint-disable no-unused-vars */
import api from '@ais/api';
import { isValidQuery } from '@ais/graphql/BuildGPLQuery';
import { useEffect, useState } from 'react';

export function Protected({ children, tId }: any) {
  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const [isProtected, setisProtected] = useState(false);

  useEffect(() => {
    const qry = isValidQuery();

    if (qry != null) {
      api.graphql(qry, { tId }).then((res) => {
        console.log(res);
        const { loading, data, error } = res;

        if (loading) setloading(loading);

        if (error) seterror(error);

        if (data) {
          setdata(data);
          setisProtected(data.entityIsValid.tid === tId);
        }
      });
    }
  }, [tId]);

  if (isProtected) return children;
  else return;
}
