import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table } from 'semantic-ui-react';

const tableColumns   = ["Symbol","Name","Sector","P0","P1","P2","Average"];
const tableColumnsMap= {
                            "Symbol" : "ticker", 
                            "Name" : "longname", 
                            "Sector" : "sector", 
                            "P0" : "p_0" , 
                            "P1" : "p_1" , 
                            "P2" : "p_2" , 
                            "Average" : "avg" 
                       };

const GetTableData = () => {
    const tickers         = useSelector(state => state.keywords)
    const dispatch        = useDispatch();

    useEffect(() => {
        if (tickers.length !== 0 ) {
            const request = {
                "tickers" : tickers
            }
            
            console.log("TABLE_POST")
            fetch("/getTableData", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(request)
            }).then(response => {
                response.json().then(data => {

                    const dataKeys        = Object.keys(data);

                    // Get Table in Cleaner Format for Sorting and Table Creation
                    const tableData  = [];
                    dataKeys.map( ticker => 
                        tableData.push({
                            ticker   : ticker,
                            longname : data[ticker][0], 
                            sector   : data[ticker][1], 
                            p_0      : data[ticker][2], 
                            p_1      : data[ticker][3], 
                            p_2      : data[ticker][4], 
                            avg      : data[ticker][5] 
                        })
                    );

                    dispatch({ type : "SET_DATA", payload: tableData})
                });
            });
        }
    }, [tickers, dispatch]);
}

const InfoBar = () => 
    <div className="explination"> 
        Click for more explination. 
        <Button>
            Info
        </Button>
    </div>


export const DataTable = () => {
    const dispatch        = useDispatch();

    // Grab Table Data
    GetTableData();

    // Grab state from the reducer
    const { column, data, direction } = useSelector(state => state.dataTable)

    return (
        <>   
        <div className="SemanticTable"> 
        <Table 
            color="black"
            compact="very"
            size="small"
            sortable={true}
        >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={3}> Information </Table.HeaderCell>
                    <Table.HeaderCell colSpan={4}> Financials </Table.HeaderCell>
                </Table.Row>
                <Table.Row >
                    {
                        tableColumns.map( col =>
                            <Table.HeaderCell key={ col }
                            colSpan={1}
                            sorted={column === tableColumnsMap[col] ? direction : null}
                            onClick={() => dispatch({ type : "CHANGE_SORT", column: tableColumnsMap[col]})}
                        > {col}  </Table.HeaderCell>
                        )
                    }
                </Table.Row>
            </Table.Header>
                <Table.Body>
                    {
                        data.map( ({ticker, longname, sector, p_0, p_1, p_2, avg}) => 
                            <Table.Row key={ ticker }>
                                <Table.Cell> {ticker}   </Table.Cell>
                                <Table.Cell> {longname} </Table.Cell>
                                <Table.Cell> {sector}   </Table.Cell>
                                <Table.Cell> {p_0}      </Table.Cell>
                                <Table.Cell> {p_1}      </Table.Cell>
                                <Table.Cell> {p_2}      </Table.Cell>
                                <Table.Cell> {avg}      </Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body>
        </Table>
       </div>
       <InfoBar/>
       </>
    )
}