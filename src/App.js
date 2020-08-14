import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const PERSON = gql`
  query SinglePerson($id: Int!) {
    person(id: $id) {
      id
      name
    }
  }
`;

const RENAME_PERSON = gql`
  mutation RenamePerson($id: Int!, $name: String!) {
    renamePerson(id: $id, name: $name) {
      id
      name
    }
  }
`;

export default function App() {

  const [queryForId, setQueryForId] = useState(2)

  const {
    loading: personLoading,
    data: personData
  } = useQuery(PERSON, { 
    variables: { id: queryForId }, 
    fetchPolicy: 'cache-and-network',
    // nextFetchPolicy: 'cache-only'
  });

  const [renameSara, { loading: renameLoading }] = useMutation(RENAME_PERSON, { variables: { id: queryForId, name: 'Jackson' } } )

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>

      <p>Changing the query variables UNSETS the `nextFetchPolicy` on this query that was set via `defaultOptions` on the apollo client:</p>

      <p>- Running the mutation without changing the query variables wont make a network call after mutation updates the cache</p>
      <p>- Running the mutation after changing the query variables will make a network call after mutation updates the cache</p>

      <p>- I would expect the defaultOptions to stick rather than being unset because the query variables have changed</p>

      <h2>PERSON (Person Query using "cache-and-network")</h2>

      {personLoading && <p>MAKING NETWORK CALL...</p>}

          <ul>
              <li>{personData && personData.person.name}</li>
          </ul>

          <h2>Change query variables</h2>
          <button onClick={() => { setQueryForId(i => i === 2 ? 1 : 2) } }>Change query variables</button>

          <br />
          <br />

          <h2>Rename mutation</h2>
          {renameLoading ? <span>RENAMING...</span> : <button onClick={renameSara}>append "Jackson" to end of name</button>}

          

          

    </main>
  );
}
