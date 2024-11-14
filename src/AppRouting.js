import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import QuizPage from './pages/QuizPage'

function AppRouting() {
    return (
        <Suspense fallback={<>Loading...</>}>
            <Routes>
                <Route path="*" element={<QuizPage />} />
            </Routes>
        </Suspense>
    )
}

export default AppRouting