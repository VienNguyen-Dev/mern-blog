import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//Redux-tôlkit để theo dõi trạng thái của ứng dụng
//Redux-persist thì lưu trữ trạng thái của ứng dụng
const rootReducer = combineReducers({
  user: userReducer
}) //Tạo một rootReducer bằng cách sử dụng hàm combineReducers để kết hợp các reducer laij với nhau, trong ứng dụng này hiện tại chỉ có một reducer là "ueReducer"

const persistConfig = {
  key: 'root',
  version: 1,
  storage
} //Cấu hình cho việc lưu trữ dùng redux-persist. Trong đó, key là key để xác định dữ liệu lưu trữ, version là phiên bản của cấu trúc dữ liệu, và storage là cách lưu trữ dữ liệu.

const persitedReducer = persistReducer(persistConfig, rootReducer);//Tạo một reducer mới đã được cấu hình để lưu trữ trạng thái vào storage, sử dụng persistReducer từ redux-persist.
export const store = configureStore({
  reducer: persitedReducer,
  middleware: (getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }))
})//Tạo một store Redux bằng cách sử dụng configureStore từ Redux Toolkit. Trong đó, reducer được sử dụng là persitedReducer, và middleware được thiết lập để không kiểm tra tính serializable của các action.

export const persistor = persistStore(store);
