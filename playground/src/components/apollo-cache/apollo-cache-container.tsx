import React from "react";
import { useApolloClient } from "@apollo/client/react";
import { useQuery, gql, useMutation } from "@apollo/client";
import cacheMock from "./cache-mock.json";
import { ApolloCacheRenderer } from "./apollo-cache-renderer";
import sizeOf from "object-sizeof";

const CHAT = gql`
  query chat {
    chat {
      messages {
        id
        message
      }
    }
  }
`;

const ADD_MESSAGES = gql`
  mutation addMessage($message: String!) {
    addMessage(message: $message) {
      messages {
        id
        message
      }
    }
  }
`;

const REMOVE_MESSAGES = gql`
  mutation removeMessage($id: String!) {
    addMessage(id: $id) {
      messages {
        id
        message
      }
    }
  }
`;

const ApolloCacheContainer = () => {
  const client = useApolloClient();
  const cache = client.cache as any;
  const { data, refetch } = useQuery(CHAT);
  const [addMessage] = useMutation(ADD_MESSAGES);
  const [removeMessage] = useMutation(REMOVE_MESSAGES);

  React.useEffect(() => {
    addMessage({ variables: { message: "test" } })
      .then(console.log)
      .catch(console.log);
    addMessage({ variables: { message: "test" } })
      .then(console.log)
      .catch(console.log);
    addMessage({ variables: { message: "test2" } })
      .then(console.log)
      .catch(console.log);
    refetch();
  }, []);

  const removeCacheItem = React.useCallback(
    (key: string) => {
      if (cache.data?.data[key]?.id) {
        removeMessage({ variables: { id: cache.data.data[key].id } })
          .then(console.log)
          .catch(console.log);
      }
      cache.evict({ id: key });
      refetch();
    },
    [cache]
  );

  if (!cache) {
    return null;
  }
  const cacheObjectsWithSize = getCacheObjectWithSizes(cache.data?.data);

  return (
    <ApolloCacheRenderer
      cacheObjectsWithSize={cacheObjectsWithSize}
      cacheSize={sizeOf(cache.data.data)}
      removeCacheItem={removeCacheItem}
    />
  );
};

function getCacheObjectWithSizes(rawCache?: Record<string, any>) {
  if (!rawCache) {
    return [];
  }

  const cacheKeys = Object.keys(rawCache);

  return cacheKeys.map((key: string) => ({
    key,
    valueSize: sizeOf(rawCache[key]),
    value: rawCache[key],
  }));
}

export default ApolloCacheContainer;
