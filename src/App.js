import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

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
  const {
    loading: personLoading,
    data: personData
  } = useQuery(PERSON, { 
    variables: { id: 2 }, 
    fetchPolicy: 'cache-only' 
  });

  const {
    loading: peopleLoading,
    data: peopleData
  } = useQuery(ALL_PEOPLE, { fetchPolicy: 'cache-and-network' });  // switch to cache-first to see the desired behavior

  const [renameSara, { loading: renameLoading }] = useMutation(RENAME_PERSON, { variables: { id: 2, name: 'Sarah with an H Smith' } } )

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This is a typical apollo setup. <br />
        There's a <b>cache-and-network</b> people query.<br />
        There's a <b>cache-only</b> person query which has a <b>typePolicy</b> configured to read the person from the cache of people rather than query individually for it.<br />
        And theres a mutation to rename a person.<br /><br/>

        Listed issues below:
      </p>
      <ul>
        <li>
          1 (main issue). After the rename mutation completes, I would expect the All People query to simply re-render from the cache with the updated name. 
          However, it ends up requerying the network. Switch the ALL_PEOPLE query to cache-first to see the desired behavior<br />
        </li>
        <li>2. Why is there a "Missing cache result fields: person" warning in the console? I've specified a cache-only fetch policy on the query, and a type policy to pull it from the list, 
          so my item not being in the cache is a perfectly valid scenario. I'd argue a warning here is unnecessary noise.
        </li>
      </ul>


      <h2>Names (People Query)</h2>
      {peopleLoading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {peopleData.people.map(person => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      )}

      <h2>PERSON (Person Query)</h2>
      {personLoading && <p>personLoading</p>}
      {personData && 
        <>
          <ul>
              <li key={personData.person.id}>{personData.person.name}</li>
          </ul>

          <h2>RENAME PERSON (Rename person mutation)</h2>
          {renameLoading ? <span>RENAMING...</span> : <button onClick={renameSara}>RENAME Sara Smith to "Sarah with an H Smith"</button>}
        </>
      }
    </main>
  );
}
