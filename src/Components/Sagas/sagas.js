import { takeEvery, put, delay } from 'redux-saga/effects';

function* incrementAsync() {
  yield delay(1000);
  yield put({ type: 'INCREMENT' });
}

function* decrementAsync() {
  yield delay(1000);
  yield put({ type: 'DECREMENT' });
}

function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

function* watchDecrementAsync() {
  yield takeEvery('DECREMENT_ASYNC', decrementAsync);
}

export default function* rootSaga() {
  yield watchIncrementAsync();
  yield watchDecrementAsync();
}
