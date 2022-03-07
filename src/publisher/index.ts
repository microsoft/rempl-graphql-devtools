import { RemplWrapper } from "./rempl-wrapper";
import { ApolloCachePublisher } from "./publishers/apollo-cache-publisher";
import { ApolloCacheDuplicatesPublisher } from "./publishers/apollo-cache-duplicates-publisher";
import { GraphiQLPublisher } from "./publishers/graphiql-publisher";
import { ApolloTrackerPublisher } from "./publishers/apollo-tracker-publisher";
import { ApolloClientsPublisher } from "./publishers/apollo-clients-publisher";
import { ApolloGlobalOperationsPublisher } from "./publishers/apollo-global-operations-publisher";

const remplWrapper = new RemplWrapper(
  "ctrl+shift+alt+0, command+shift+option+0"
);

const publisher = remplWrapper
  .getRempl()
  .createPublisher("apollo-devtools", (_: any, callback: any) => {
    callback(null, "script", __APOLLO_DEVTOOLS_SUBSCRIBER__);
  });

new ApolloClientsPublisher(remplWrapper, publisher);
new ApolloCachePublisher(remplWrapper, publisher);
new ApolloTrackerPublisher(remplWrapper, publisher);
new ApolloGlobalOperationsPublisher(remplWrapper, publisher);
new GraphiQLPublisher(remplWrapper, publisher);
new ApolloCacheDuplicatesPublisher(remplWrapper, publisher);
