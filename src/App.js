import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Subject from "./components/Subject";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/subject/:trending' element={<Subject />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
