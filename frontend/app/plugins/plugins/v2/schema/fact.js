import api from "@ais/api";
import { Heading, SimpleCard, TableLayout, toast } from "@ais/components";
import { SimpleTable } from "@ais/datatable";
import { jsonToGraphQLQuery } from "@ais/graphql";
import moment from "moment";
import React, { useState } from "react";

function FactList() {

    const [factData, setfactData] = useState([]);


    React.useEffect(() => {
        const gjson = {
            query: {
                getFacts: {
                    factId: true,
                    factName: true,
                    factDatatype: true,
                    factDesc: true,
                    factType: true,
                    createdDate: true,
                    updateDate: true
                }
            }
        }

        const graphqlQuery = jsonToGraphQLQuery(gjson);

        api.graphql(graphqlQuery).then((res) => {
            const { error, data } = res;

            if (error) {
                toast({
                    title: "Error Retriving facts",
                    Variant: "error"
                });
            }

            if (data) setfactData(data['getFacts']);


        });

    }, []);


    return (

        <TableLayout>
            <Heading title={`Fact List`} subHeading={`List of Functions that is usable in Rule configuration.`}>
                <SimpleCard>
                    <SimpleTable data={factData}
                        columns={{
                            factId: {
                                show: false
                            },
                            factName: {
                                label: "Expression",
                            },
                            factDatatype: {
                                label: "Data Type"
                            }, factDesc: {
                                label: "Description"
                            }, factType: {
                                label: "Fact Type"
                            }, createdDate: {
                                label: "Created At",
                                render: (row) => <span>{new moment(row.createdDate).format("DD-MMM-YY hh:mm A")}</span>
                            }, updateDate: {
                                label: "Updated At",
                                render: (row) => <span>{new moment(row.updateDate).format("DD-MMM-YY hh:mm A")}</span>
                            }
                        }}
                    />
                </SimpleCard>
            </Heading>
        </TableLayout>

    );
}

export default FactList;