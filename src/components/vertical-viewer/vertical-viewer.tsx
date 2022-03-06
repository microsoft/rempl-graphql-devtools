import React from "react";
import {
  Box,
  Button,
  ChevronEndIcon,
  ChevronStartIcon,
  Flex,
  Text,
  Tooltip,
} from "@fluentui/react-northstar";
import { useStyles } from "./vertical-viewer-styles";

interface IDataItem {
  name: string;
  variables: Record<string, unknown>;
  queryString?: string;
  mutationString?: string;
  errorMessage?: string;
  cachedData?: Record<string, unknown>;
}

interface VerticalViewerProps {
  data: IDataItem;
  isExpanded: boolean;
  onExpand: any;
  isMutation?: boolean;
}

export const VerticalViewer = React.memo(
  ({ data, isExpanded, onExpand, isMutation }: VerticalViewerProps) => {
    const classes = useStyles();

    return (
      <Flex
        column
        gap="gap.small"
        className={classes.container}
        styles={{ width: isExpanded ? "100%" : "auto" }}
      >
        <Flex vAlign="center">
          <Tooltip
            trigger={
              <Button
                className={classes.controlButton}
                icon={
                  isExpanded ? (
                    <ChevronEndIcon size="small" />
                  ) : (
                    <ChevronStartIcon size="small" />
                  )
                }
                tinted
                iconOnly
                onClick={onExpand}
              />
            }
            content={isExpanded ? "Show list" : "Expand"}
          />
          <Text
            weight="semibold"
            color="green"
            content={`${data.name} (${
              isMutation ? "Mutation" : "Watched Query"
            })`}
          />
        </Flex>
        <Box>
          <Text
            weight="bold"
            content={isMutation ? "Mutation String" : "Query String"}
          />
          <Box styles={{ fontSize: "12px" }}>
            <pre>
              <code>
                <p>{isMutation ? data.mutationString : data.queryString}</p>
              </code>
            </pre>
          </Box>
        </Box>
        <Box>
          <Text weight="bold" content="Variables" />
          <Box styles={{ fontSize: "11px" }}>
            <pre>
              <code>
                <p>{JSON.stringify(data.variables, null, 2)}</p>
              </code>
            </pre>
          </Box>
        </Box>
        {data.errorMessage && (
          <Box>
            <Text weight="bold" content="Error" />
            <Box styles={{ fontSize: "11px" }}>
              <pre>
                <code>
                  <p>{data.errorMessage}</p>
                </code>
              </pre>
            </Box>
          </Box>
        )}
        {!isMutation && (
          <Box>
            <Text weight="bold" content="Cache Data" />
            <Box styles={{ fontSize: "11px" }}>
              <pre>
                <code>
                  <p>{JSON.stringify(data.cachedData, null, 2)}</p>
                </code>
              </pre>
            </Box>
          </Box>
        )}
      </Flex>
    );
  }
);
