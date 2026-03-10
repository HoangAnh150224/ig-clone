import React from "react";
import { Grid, GridItem, Skeleton, Box } from "@chakra-ui/react";

const ExploreSkeleton = () => {
    return (
        <Grid
            templateColumns="repeat(3, 1fr)"
            gap="4px"
            autoRows="calc((100vw - 72px - 8px) / 3)"
            maxW="935px"
            mx="auto"
        >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                const isLarge = i === 3 || i === 6;
                return (
                    <GridItem
                        key={i}
                        colSpan={isLarge ? 2 : 1}
                        rowSpan={isLarge ? 2 : 1}
                    >
                        <Skeleton height="100%" width="100%" borderRadius="0" />
                    </GridItem>
                );
            })}
        </Grid>
    );
};

export default ExploreSkeleton;
