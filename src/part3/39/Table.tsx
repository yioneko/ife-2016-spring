import React, { useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableProps<H extends string, D extends Record<H, any>>
    extends React.ComponentPropsWithRef<"table"> {
    headings: Array<H>;
    data: Array<D & { key: string }>;
    comparators?: {
        [K in H]?: (a: D[K], b: D[K], ascending: boolean) => number;
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Table<H extends string, D extends Record<H, any>>(
    props: TableProps<H, D>
): React.ReactElement {
    const { headings, data, comparators, ...tableProps } = props;
    const [order, setOrder] = useState<{ orderBy?: H; ascending: boolean }>({
        orderBy: undefined,
        ascending: false,
    });

    const tableHeading = useMemo(
        () => (
            <thead>
                <tr>
                    {headings.map((heading) => (
                        <th
                            className={
                                heading === order.orderBy
                                    ? `sorted sorted-${
                                          order.ascending
                                              ? "ascending"
                                              : "descending"
                                      }`
                                    : undefined
                            }
                            onClick={() => {
                                if (comparators && comparators[heading]) {
                                    setOrder((prevOrder) => {
                                        if (prevOrder.orderBy === heading)
                                            return {
                                                ...prevOrder,
                                                ascending: !prevOrder.ascending,
                                            };
                                        else
                                            return {
                                                orderBy: heading,
                                                ascending: false,
                                            };
                                    });
                                }
                            }}
                            key={heading}
                        >
                            {heading}
                        </th>
                    ))}
                </tr>
            </thead>
        ),
        [comparators, headings, order.ascending, order.orderBy]
    );

    const tableBody = useMemo(() => {
        const { orderBy, ascending } = order;
        const sortedData = [...data];
        if (comparators && orderBy) {
            const comparator = comparators[orderBy];
            if (comparator) {
                sortedData.sort((a, b) =>
                    comparator(a[orderBy], b[orderBy], ascending)
                );
            }
        }

        return (
            <tbody>
                {sortedData.map((row) => (
                    <tr key={row.key}>
                        {headings.map((heading) => (
                            <td key={heading}>{row[heading]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    }, [comparators, data, headings, order]);

    return (
        <table {...tableProps}>
            {tableHeading}
            {tableBody}
        </table>
    );
}
