import {legacy_createStore as createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import counterReducer from '../Reducer/counterReducer';
import rootSaga from '../Sagas/sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  counterReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
