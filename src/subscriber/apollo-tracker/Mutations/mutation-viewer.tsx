import * as React from "react";
import { Box, Flex } from "@fluentui/react-northstar";

interface MutationViewerProps {
  mutationString: string;
  variables: Record<string, unknown>;
}

export const MutationViewer = ({
  mutationString,
  variables = {},
}: MutationViewerProps) => (
  <Flex gap="gap.small" padding="padding.medium">
    <Flex.Item grow>
      <Box>
        <h4>Mutation String</h4>
        <Box styles={{ fontSize: "12px" }}>
          <pre>
            <code>
              <p>{mutationString}</p>
            </code>
          </pre>
        </Box>
      </Box>
    </Flex.Item>
    <Flex.Item size="size.querter" push>
      <Box>
        <h4>Variables</h4>
        <Box styles={{ fontSize: "11px" }}>
          <pre>
            <code>
              <p>{JSON.stringify(variables, null, 2)}</p>
            </code>
          </pre>
        </Box>
      </Box>
    </Flex.Item>
  </Flex>
);
