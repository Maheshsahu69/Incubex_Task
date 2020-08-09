import React,{Suspense,lazy} from 'react';
import "./App.css";
const FetchPosts=lazy(()=>import('./Components/FetchPosts'));

const App = () => {
  return (
    <div className="outer-div">
      <Suspense fallback={<div style={{fontWeight:"bold"}}>Loading data...</div>}>
      <FetchPosts />
      </Suspense>
    </div>
  )}
export default App;