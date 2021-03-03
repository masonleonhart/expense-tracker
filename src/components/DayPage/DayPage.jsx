import React, { useEffect, forwardRef } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';

import MaterialTable from "material-table";

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

import './DayPage.css';

function InfoPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentDay = useSelector(store => store.expense.currentDayReducer); // The current day that is stored in the ecpense reducer
  const expense = useSelector(store => store.expense); // Access the espense store
  const category = useSelector(store => store.category); // Access the category store

  const toCurrency = new Intl.NumberFormat('en-US', {
    // Converts a number to US currency format

    style: 'currency',
    currency: 'USD',
  });

  const useStyles = makeStyles({
    arrowNav: {
      borderRadius: '50%',
      borderWidth: '2px'
    },
    dayNav: {
      minHeight: '64px',
      borderRadius: '50%'
    }
  });

  const classes = useStyles();

  const handleClick = (incomingDay) => {
    // Fetches expenses and categories for the new day that the user is navigating to

    dispatch({ type: 'FETCH_DAILY_EXPENSES', payload: { incomingDay, currentDay: currentDay + incomingDay } });
    dispatch({ type: 'FETCH_DAILY_CATEGORIES', payload: currentDay + incomingDay });
  };

  useEffect(() => {
    // Fetches expenses and categories

    dispatch({ type: 'FETCH_DAILY_EXPENSES', payload: { incomingDay: 0, currentDay } });
    dispatch({ type: 'FETCH_DAILY_CATEGORIES', payload: currentDay });
  }, []);

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <Button onClick={() => {
        // Lets you navigate to the month page of the displayed month if the user clicks on the h1

        let clickedMonth = moment().add(currentDay, 'days').startOf('month');
        let currentMonth = moment().startOf('month');
        let difference = clickedMonth.diff(currentMonth, 'months')

        dispatch({ type: 'GO_TO_MONTH', payload: difference });
        history.push('/month');
      }}><h1>{moment().add(currentDay, 'days').format('MMMM')}</h1></Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '40%' }}>
          <Button variant='outlined' className={classes.arrowNav} onClick={() => handleClick(-1)}><h1 style={{ margin: '0' }}>‹</h1></Button>
          <Button className={classes.dayNav} onClick={() => handleClick(-2)}><h4 style={{ margin: '0' }}>{moment().add(currentDay - 2, 'days').format('DD')}</h4></Button>
          <Button className={classes.dayNav} onClick={() => handleClick(-1)}><h4 style={{ margin: '0' }}>{moment().add(currentDay - 1, 'days').format('DD')}</h4></Button>
          <h2 style={{ margin: '0', userSelect: 'none' }}>{moment().add(currentDay, 'days').format('DD')}</h2>
          <Button className={classes.dayNav} onClick={() => handleClick(1)}><h4 style={{ margin: '0' }}>{moment().add(currentDay + 1, 'days').format('DD')}</h4></Button>
          <Button className={classes.dayNav} onClick={() => handleClick(2)}><h4 style={{ margin: '0' }}>{moment().add(currentDay + 2, 'days').format('DD')}</h4></Button>
          <Button variant='outlined' className={classes.arrowNav} onClick={() => handleClick(1)}><h1 style={{ margin: '0' }}>›</h1></Button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <MaterialTable
        style={{ maxWidth: '80%', margin: 'auto' }}
        title='Categories'
        icons={tableIcons}
        columns={[
          { title: 'Name', field: 'name' },
          {
            title: 'Category of Necessities', render: (rowData) => {
              return (
                <>
                  {!category.dailyCategoryReducer.necessity ? <p>Yes</p> : <p>No</p>}
                </>
              );
            }
          },
          { title: 'Amount Spent in Category', field: 'sum', type: 'currency' }
        ]}
        data={category.dailyCategoryReducer}
      />
      <br />
      <br />
      <MaterialTable
        style={{ maxWidth: '80%', margin: 'auto' }}
        title='Transactions'
        icons={tableIcons}
        columns={[
          { title: 'Name', field: 'name' },
          {
            title: 'Date', render: (rowData) => {
              return (
                <>
                  {moment(rowData.date).format('YYYY-MM-DD')}
                </>
              );
            }
          },
          { title: 'Category', field: 'category_name' },
          {
            title: 'Amount', type: 'currency', render: (rowData) => {
              return (
                <p className={rowData.income ? 'income-amount' : 'expense-amount'}>
                  {toCurrency.format(Number(rowData.amount) < 0 ?
                    (Number(rowData.amount) * -1) : Number(rowData.amount))}
                </p>
              );
            }
          },
        ]}
        data={expense.dailyExpenseReducer}
      />
    </div>
  );
};

export default InfoPage;