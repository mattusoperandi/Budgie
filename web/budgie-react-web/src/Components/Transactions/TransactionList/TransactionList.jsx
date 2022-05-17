import React, { useContext, useState } from 'react'
import { TransactionContext } from '../../../Contexts/TransactionsManager/TransactionsManager'
import RechartsCategoryBarChart from '../../Charts/RechartsCategoryBarChart';
import MoneyDisplay from '../../MoneyDisplay/MoneyDisplay';
import TransactionItem from '../TransactionItem/TransactionItem'

import RechartsCategoryPieChart from '../../Charts/RechartsCategoryPieChart';

import ChartsJSCategoryPieChart from '../../Charts/ChartsJSCategoryPieChart';

import TransactionSorting, { sortByAmount, sortingController } from '../../../SortingFunctions/TransactionSorting';
import AddBudgetItem from '../AddBudgetItem/AddBudgetItem';
import ChartsJSLineChart from '../../Charts/ChartsJSLineChart';

import {ReactComponent as ShowIcon} from '../../../img/show.svg'
import {ReactComponent as HideIcon} from '../../../img/hide.svg'
import PaginationBar from '../../PaginationBar/PaginationBar';

export default function TransactionList(props) {

    const transactions = useContext(TransactionContext)

    // amount | category | note | transactionDate
    const [sort, setSort] = useState("amount")

    // descending | ascending
    const [ascending, setAscending] = useState(true)

    const [showAddForm, setShowAddForm] = useState(true);

    const [pageOffset, setPageOffset] = useState(0);

    const pageSize = 10;

    const pageCount = Math.ceil(transactions.transactions.length / pageSize)

    const nextPage = () => {
        if(pageOffset < pageCount - 1) {
            setPageOffset(pageOffset + 1)
        }
    }

    const lastPage = () => {
        if(pageOffset < pageCount - 1) {
            setPageOffset(pageCount - 1)
        }
    }

    const checkIfNextPage = () => {
        return pageOffset < pageCount - 1;
    }

    const previousPage = () => {
        if(pageOffset > 0) {
            setPageOffset(pageOffset - 1)
        }
    }
    const firstPage = () => {
        if(pageOffset > 0) {
            setPageOffset(0)
        }
    }

    const checkIfPreviousPage = () => {
        return pageOffset > 0;
    }

    const checkIfOnFirstPage = () => {
        return pageOffset === 0;
    }

    const checkIfOnLastPage = () => {
        return pageOffset === pageCount - 1;
    }

    if(props.filter === "expense") {
        transactions.transactions =  transactions.transactions.filter(transaction => transaction.amount < 0);
    }

    if(props.filter === "income") {
        transactions.transactions =  transactions.transactions.filter(transaction => transaction.amount >= 0);
    }

    const getTotal = () => {
        let value = 0;
        transactions.transactions.forEach(transaction => {
            value += transaction.amount
        })

        return value;
    }

    let changeSortToAmount = () => {
        if(sort !== "amount") {
            setSort("amount")
        } else {
            setAscending(!ascending)
        }   
    }

    let changeSortToCategory = () => {

        if(sort !== "category") {
            setSort("category")
        } else {
            setAscending(!ascending)
        }
    }

    let changeSortToNote = () => {

        if(sort !== "note") {
            setSort("note")
        } else {
            setAscending(!ascending)
        }
            
    }

    let changeSortToDate = () => {
        if(sort !== "transactionDate") {
            setSort("transactionDate")
        } else {
            setAscending(!ascending)
        }
    }

    let sortTransactions = () => {
        try {
            return sortingController({
                sortType:sort, 
                transactions: transactions.transactions, 
                ascending
            })
        } catch(err) {
        }
    }

    const color = () => {
        if(props.filter === "income") {
            return "#00C853"
        }

        if(props.filter === "expense") {
            return "#D50000"
        }

        return "#D437AD"
    }

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm)
    }


    return (
        <div className="transaction-page">
            <div className="sum-line"><MoneyDisplay amount={ getTotal() }></MoneyDisplay></div>

        <div className="chart-block">
            <div className="chart-display">
                        <ChartsJSLineChart filter={props.filter}/>
                        {props.filter === "income" || props.filter === "expense" ? <ChartsJSCategoryPieChart /> : ""}
                    </div>
        </div>
            

            <div className="transaction-list-header">
                <div className="column" onClick={changeSortToAmount}>Amount</div>
                <div className="column" onClick={changeSortToCategory}>Category</div>
                <div className="column" onClick={changeSortToNote}>Note</div>
                <div className="column" onClick={changeSortToDate}>Date</div>
                <div className="form-button-container">
                    <div className="tool-tip">
                        <div className="tool-tip-text">{showAddForm ? "Hide" : "Show" }</div>
                            {props.showAdd ? <button className="ui-icon" onClick={toggleAddForm}>{showAddForm ? <ShowIcon /> : <HideIcon /> }</button> : ""}
                        </div>
                    </div>
            </div>

            {showAddForm && props.showAdd ? <AddBudgetItem income={props.filter === "income" ? true : false}/> : ""}
            
            <div className="transaction-list centred-list">
                { sortTransactions().slice(pageOffset*pageSize, (pageOffset*pageSize)+pageSize).map(transaction => <TransactionItem key={transaction.id} id={transaction.id} dollars={transaction.amount} category={ transaction.category ? transaction.category.categoryName : ''} note={transaction.note} transactionDate={transaction.transactionDate}></TransactionItem>) }
            </div>
            
            
            <PaginationBar 
                checkIfNextPage={checkIfNextPage()} 
                checkIfOnFirstPage={checkIfOnFirstPage()}
                checkIfPreviousPage={checkIfPreviousPage()}
                checkIfOnLastPage={checkIfOnLastPage()}
                nextPage={nextPage}
                previousPage={previousPage}
                firstPage={firstPage}
                lastPage={lastPage}
                pageOffset={pageOffset+1}
                pageCount={pageCount}

            />
        </div>
    )
}
