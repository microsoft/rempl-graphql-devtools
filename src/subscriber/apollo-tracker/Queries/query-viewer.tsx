import * as React from "react";
import { Box, Flex } from "@fluentui/react-northstar";

interface QueryViewerProps {
  queryString: string;
  variables: Record<string, unknown>;
  cachedData: Record<string, unknown>;
}

export const QueryViewer = ({
  queryString = "",
  variables = {},
  cachedData = {},
}: QueryViewerProps) => (
  <Flex gap="gap.small" padding="padding.medium">
    <Flex.Item grow>
      <Box>
        <h4>Query String</h4>
        <Box styles={{ fontSize: "12px" }}>
          <pre>
            <code>
              <p>{queryString}</p>
            </code>
          </pre>
        </Box>
      </Box>
    </Flex.Item>
    <Flex.Item size="size.querter" push>
      <Box>
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
        <Box>
          <h4>Cache Data</h4>
          <Box styles={{ fontSize: "11px" }}>
            <pre>
              <code>
                <p>{JSON.stringify(cachedData, null, 2)}</p>
              </code>
            </pre>
          </Box>
        </Box>
      </Box>
    </Flex.Item>
  </Flex>
);
