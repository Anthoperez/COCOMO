import { Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Welcome from "./pages/Welcome"
//import Cocomo from "./pages/Cocomo"
import CocomoTwo from "./pages/CocomoTwo"
import FunctionPoint from "./pages/FunctionPoint"
import UseCasePoints from "./pages/UseCasePoints"
import NoPage from "./pages/NoPage"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/app" element={<Layout/>}>
          <Route index element={<CocomoTwo/>}/>
          {/* <Route path="cocomo" element={<Cocomo/>}/> */}
          <Route path="cocomo-two" element={<CocomoTwo/>}/>
          <Route path="function-point" element={<FunctionPoint/>}/>
          <Route path="use-case-point" element={<UseCasePoints/>}/>
          <Route path="*" element={<NoPage/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
